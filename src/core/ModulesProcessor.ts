import {EventDispatcher} from './EventDispatcher';
import {AbstractModule, AbstractModuleStatus} from './AbstractModule';
import Viewer from '../rendering/Viewer';
import FrameworkViewer from '../rendering/Viewer';
import {IViewerConfig} from '../rendering/IViewerConfig';
import {AgentsFabric} from '../agents/AgentsFabric';
import {addDefaultLoaders, Loader, ResourcesManager} from '../loaders';
import {Bootstrap} from './Bootstrap';
import createUniversalAgent = AgentsFabric.createUniversalAgent;

export class ModulesProcessor extends EventDispatcher {
    private modulesStatus: Map<AbstractModule, AbstractModuleStatus> = new Map<AbstractModule, AbstractModuleStatus>();

    constructor(private configuration: {
        modules: Array<AbstractModule>,
        viewerConfig: IViewerConfig,
        bootstrap: Bootstrap
    }) {
        super();
        this.prepareRenderer();
        this.prepareResourcesManager();
        this.modulesPreInitialization()
            .then(() => this.modulesInitialization())
            .then(() => this.modulesAfterInitialization())
            .then(() => {
                this.viewer.setCurrentViewer(this.configuration.bootstrap);
                this.configuration.bootstrap.onInit(this);
            })
            .then(() => this._viewer.on('update', (event) => this.update(event.data.frame)));

    }

    private _agents: Map<any, any> = new Map<any, any>();

    get agents(): Map<any, any> {
        return this._agents;
    }

    private _modulesInstances: Map<AbstractModule, Array<any>> = new Map<AbstractModule, Array<any>>();

    get modulesInstances(): Map<AbstractModule, Array<any>> {
        return this._modulesInstances;
    }

    private _viewer: Viewer;

    get viewer(): FrameworkViewer {
        return this._viewer;
    }

    private _resourcesManager: ResourcesManager;

    get resourcesManager(): ResourcesManager {
        return this._resourcesManager;
    }

    private async modulesPreInitialization(): Promise<void> {
        for (const module of this.configuration.modules) {
            const status: AbstractModuleStatus = await module.preInit();
            this.modulesStatus.set(module, status);
        }
    }

    private async modulesInitialization(): Promise<void> {
        const modulesInstances = [];
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            const instances: Array<any> = await module.onInit({
                viewer: this._viewer,
                resourcesManager: this._resourcesManager,
            });
            this._modulesInstances.set(module, instances);
            modulesInstances.splice(modulesInstances.length, 0, ...instances);
        }
        // create agents
        const instancesParent = new Map<any, Array<any>>();
        for (const instance of modulesInstances) {
            const instanceProto = instance.__proto__.__proto__;
            if (!instanceProto) continue;
            if (instanceProto.constructor.name === 'Object') continue;
            if (!(instancesParent.get(instanceProto) instanceof Array)) instancesParent.set(instanceProto, []);
            instancesParent.get(instanceProto).push(instance);
        }
        this._agents = new Map();
        instancesParent.forEach((instances, instancesParentKey) => {
            if (instancesParentKey.hasOwnProperty('__agentConstructor')) {
                this._agents.set(instancesParentKey.constructor, new instancesParentKey.__agentConstructor(instances));
            } else if (instancesParentKey === Loader.prototype) {
                instances.forEach(instance => this.resourcesManager.addLoader(instance));
            } else if (instances.length > 1) this._agents.set(instancesParentKey.constructor, createUniversalAgent(instances));
        });
    }

    private async modulesAfterInitialization(): Promise<void> {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            module.afterInit();
        }
    }

    private prepareRenderer(): void {
        this._viewer = new Viewer(this.configuration.viewerConfig);
    }

    private prepareResourcesManager(): void {
        this._resourcesManager = new ResourcesManager();
        addDefaultLoaders(this._resourcesManager);
    }

    private update(frame: any) {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            module.onUpdate({currentTime: performance.now(), frame: frame});
        }
    }

    private destroy() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            module.onDestroy();
        }
    }

    private pause() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            module.onPause();
        }
    }

    private resume() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module).enabled) continue;
            module.onResume();
        }
    }
}