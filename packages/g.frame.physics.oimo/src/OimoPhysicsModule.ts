import {Object3D} from 'three';
import {PhysicMeshUpdater} from './three.utils';
import {AbstractModule, AbstractModuleStatus} from '@verybigthings/g.frame.core';
import {WorldFactory} from './WorldFactory';
import {afterRender, beforeRender, lines, triangles} from './three.debugger';
import {OimoMousePuller} from "./three.utils/OimoMousePuller";

const delay = async time => new Promise(resolve => setTimeout(resolve, time));


export class OimoPhysicsModule extends AbstractModule {
    private readonly container: Object3D;
    private physicMeshUpdater: PhysicMeshUpdater;
    private worldFactory: WorldFactory;
    private oimoMousePuller: OimoMousePuller;

    constructor() {
        super();
        this.container = new Object3D();
        this.container.add(lines, triangles);
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.info('Module pre initialization.. Just make sure, that module is supported.');
        // await delay(100);
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        console.info('Module initialization. Create all instances.');
        return [
            this.physicMeshUpdater = new PhysicMeshUpdater(),
            this.worldFactory = new WorldFactory(),
            this.oimoMousePuller = new OimoMousePuller(),
        ];
    }

    onResourcesReady(): void {
        // this.templateB.addResources();
    }

    getModuleContainer(): Object3D | void {
        return this.container;
    }

    afterInit(): void {
        console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.log('onUpdate');
        beforeRender();
        this.physicMeshUpdater.update();
        this.worldFactory.update();
        afterRender();
        // console.info('Module on update function. Use it to update instances.');
    }

    onDestroy(): void {
        console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}