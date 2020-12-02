import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';
import {PhysicsExample} from "./PhysicsExample";
import PhysicsBreakableJointExample from "./PhysicsBreakableJointExample";
import {OimoPhysicsModule, PhysicMeshUpdater, WorldFactory} from "@verybigthings/g.frame.physics.oimo";

const delay = async time => new Promise(resolve => setTimeout(resolve, time));


export class TemplateModule extends AbstractModule {
    public example: PhysicsExample;
    private readonly container: Object3D;

    constructor() {
        super();
        this.container = new Object3D();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.info('Module pre initialization.. Just make sure, that module is supported.');
        await delay(100);
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        console.info('Module initialization. Create all instances.');
        return [
            this.example = new PhysicsBreakableJointExample(),
            // new TemplateC(),
        ];
    }

    getModuleContainer(): Object3D | void {
        return this.container;
    }

    afterInit(agents: ConstructorInstanceMap<any>, modules: ConstructorInstanceMap<AbstractModule>): void {
        console.log(modules);
        const physicsModule = (<OimoPhysicsModule>modules.get(OimoPhysicsModule));
        // @ts-ignore
        this.example.init(agents.get(ActionController), (<PhysicMeshUpdater>physicsModule.physicMeshUpdater), (<WorldFactory>physicsModule.worldFactory), this.container);

        console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        this.example.update();
    }

    onDestroy(): void {
        console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}