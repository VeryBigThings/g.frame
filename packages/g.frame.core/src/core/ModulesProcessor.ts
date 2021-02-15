import {EventDispatcher} from './EventDispatcher';
import {AbstractModule, AbstractModuleStatus} from './AbstractModule';
import {AgentsFabric} from '../agents/AgentsFabric';
import {Bootstrap} from './Bootstrap';
import {Object3D} from 'three';
import {ConstructorInstanceMap} from '../utils/ConstructorInstanceMap';
import createUniversalAgent = AgentsFabric.createUniversalAgent;
import * as TWEEN from '../utils/animation/Tween';
import {ViewerAbstract, RenderModuleAbstract} from '../rendering/index';

type Agent<T> = T;

interface IModulesList {
    [id: number]: Array<AbstractModule>
}


export class ModulesProcessor extends EventDispatcher<string> {
    public readonly agents: ConstructorInstanceMap<any>;
    public readonly modulesInstances: Map<typeof AbstractModule, Array<any>> = new Map<typeof AbstractModule, Array<any>>();
    // public readonly modules: ConstructorInstanceMap<AbstractModule>;
    // public readonly modules: Map<string, AbstractModule>;
    public readonly modules: Array<AbstractModule>;
    public viewer: ViewerAbstract;
    private modulesStatus: Map<AbstractModule, AbstractModuleStatus> = new Map<AbstractModule, AbstractModuleStatus>();

    constructor(private configuration: {
        modules: Array<AbstractModule>,
        // viewer: RenderAbstract,
        bootstrap: Bootstrap
    }) {
        super();

        this.agents = new ConstructorInstanceMap<any>();
        // this.modules = new ConstructorInstanceMap<AbstractModule>();
        // this.modules = new Map<string, AbstractModule>();
        this.modules = [];

        // this.viewer = new Viewer(this.configuration.viewerConfig);
        // this.viewer = this.configuration.viewer; //ft

        console.log('MPConstr', this.configuration);

        const modulesList = this.modulesPrioritySort(this.configuration.modules);

        console.log('SORT', modulesList);

        this.modulesPreInitialization(modulesList)
            .then(() => this.modulesInitialization(modulesList))

            .then(() => {
                let renderModule = null;

                this.modules.forEach(element => {
                    if(element instanceof RenderModuleAbstract) renderModule = element;
                });

                this.viewer = renderModule.getViewer();

                this.viewer.setCurrentViewer(this.configuration.bootstrap);
                this.configuration.bootstrap.onInit(this);
            })

            .then(() => this.placeModulesOnScene())

            .then(() => this.modulesAfterInitialization())

            .then(() => this.viewer.on('update', (event) => this.update(event.data.frame)));
    }

    private async modulesPreInitialization(list: IModulesList): Promise<void> {
        for (const prio in list) {
            console.log(prio, list[prio]);

            for (const module of list[prio]) {
                const status: AbstractModuleStatus = await module.preInit();

                this.modulesStatus.set(module, status);

                // this.modules.set(Object.getPrototypeOf(module).constructor, module);
                // this.modules.set(module.getModuleName(), module);
                this.modules.push(module);
            }

        }   
    }

    private async modulesPreInitialization_(): Promise<void> {
        for (const module of this.configuration.modules) {

            if (module.__requiredModules?.length) {

                const notImportedModules = module.__requiredModules.filter(requiredModule =>
                    this.configuration.modules.filter(module => module instanceof requiredModule).length === 0
                );

                if (notImportedModules.length > 0) {
                    console.error('No module found but required!', notImportedModules, module);
                    throw Error('No module found but required!');
                }

            }

            const status: AbstractModuleStatus = await module.preInit();
            this.modulesStatus.set(module, status);
            // this.modules.set(Object.getPrototypeOf(module).constructor, module);

        }
    }

    private modulesPrioritySort(modules: Array<AbstractModule>) {
        
        const list = {
            0: [],
        };

        for (const module of modules) {
            if (module.__requiredModules?.length) {
                const deep = this.getDependencyChain(module);

                if (list[deep]) {
                    list[deep].push(module);
                } else {
                    list[deep] = [module];
                }
            } else {
                list[0].push(module);
            }
        }

        return list;

    }

    private getDependencyChain(module) {
        let deep = 0;

        module.__requiredModules.forEach(requiredModule => {

            this.configuration.modules.forEach((mod) => {

                if (mod instanceof requiredModule) {
                    deep = Math.max(deep, 1);

                    if (mod.__requiredModules?.length) {
                        deep = Math.max(deep, this.getDependencyChain(mod));
                    }
                }

            }) 
            
        });

        return deep;

    }

    private async modulesInitialization(list: IModulesList): Promise<void> {
        const modulesInstances = [];

        for (const prio in list) {

            for (const module of list[prio]) {
                const instances: Array<any> = await module.onInit(this.modules);

                this.modulesInstances.set(Object.getPrototypeOf(module).constructor, instances);

                modulesInstances.splice(modulesInstances.length, 0, ...instances);

            }

        }  

        // for (const module of this.configuration.modules) {

        //     if (!this.modulesStatus.get(module).enabled) continue;

        //     // const instances: Array<any> = await module.onInit({
        //     //     viewer: this.viewer
        //     // });

        //     const instances: Array<any> = await module.onInit(this.modules);

        //     this.modulesInstances.set(Object.getPrototypeOf(module).constructor, instances);

        //     modulesInstances.splice(modulesInstances.length, 0, ...instances);
        // }

        // create agents
        const instancesParent = new Map<any, Array<any>>();

        for (const instance of modulesInstances) {

            const instanceProto = instance.__proto__.__proto__;

            if (!instanceProto) continue;

            if (instanceProto.constructor.name === 'Object') continue;

            if (!(instancesParent.get(instanceProto) instanceof Array)) instancesParent.set(instanceProto, []);

            instancesParent.get(instanceProto).push(instance);
        }

        instancesParent.forEach((instances, instancesParentKey) => {

            if (instancesParentKey.hasOwnProperty('__agentConstructor') && instancesParentKey.__agentConstructor instanceof Function) {

                this.agents.set(instancesParentKey.constructor, new instancesParentKey.__agentConstructor(instances));

            } else if (instances.length > 1) this.agents.set(instancesParentKey.constructor, createUniversalAgent(instances));
        });

        this.fire('module_init');
    }

    private async modulesAfterInitialization(): Promise<void> {

        for (const module of this.configuration.modules) {

            if (!this.modulesStatus.get(module).enabled) continue;

            // module.afterInit(this.agents, this.modules);

        }
    }

    private update(frame: any) {

        TWEEN.update(performance.now());

        for (const module of this.configuration.modules) {

            if (!this.modulesStatus.get(module).enabled) continue;

            module.onUpdate({currentTime: performance.now(), frame: frame});
        }
    }

    public destroy() {

        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            module.onDestroy();
        }
        
        this.configuration.bootstrap.dispose();
        this.viewer.dispose();
    }

    public pause() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            module.onPause();
        }
    }

    public resume() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            module.onResume();
        }
    }

    private placeModulesOnScene() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            const object = module.getModuleContainer();
            if (object && object instanceof Object3D) {
                this.viewer.modulesContainer.add(object);
            }
        }
    }
}