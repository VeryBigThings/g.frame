import {Object3D} from 'three';
import {PhysicMeshLinkType, PhysicMeshUpdater} from './three.utils';
import {AbstractModule, AbstractModuleStatus} from 'g.frame.core';
import {WorldFactory} from './WorldFactory';
import {afterRender, beforeRender, lines, triangles} from './three.debugger';
import {oimo} from 'oimophysics';
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import {OimoMousePuller} from './three.utils/OimoMousePuller';

const delay = async time => new Promise(resolve => setTimeout(resolve, time));


export class OimoPhysicsModule extends AbstractModule {
    private readonly container: Object3D;
    private _physicMeshUpdater: PhysicMeshUpdater;
    private _worldFactory: WorldFactory;
    private _oimoMousePuller: OimoMousePuller;

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
            this._physicMeshUpdater = new PhysicMeshUpdater(),
            this._worldFactory = new WorldFactory(),
            this._oimoMousePuller = new OimoMousePuller(),
        ];
    }

    get oimoMousePuller(): OimoMousePuller {
        return this._oimoMousePuller;
    }

    set oimoMousePuller(value: OimoMousePuller) {
        console.error('You are trying to redefine instance in AbstractModule');
    }
    get worldFactory(): WorldFactory {
        return this._worldFactory;
    }

    set worldFactory(value: WorldFactory) {
        console.error('You are trying to redefine instance in AbstractModule');
    }
    get physicMeshUpdater(): PhysicMeshUpdater {
        return this._physicMeshUpdater;
    }

    set physicMeshUpdater(value: PhysicMeshUpdater) {
        console.error('You are trying to redefine instance in AbstractModule');
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

    register(obj: Object3D, rigidBody?: RigidBody, linkType: PhysicMeshLinkType = PhysicMeshLinkType.RIGID_BODY_MESH_FULL) {
        this._physicMeshUpdater.register(obj, rigidBody, linkType);
    }

    remove(obj: Object3D) {
        this._physicMeshUpdater.remove(obj);
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.log('onUpdate');
        beforeRender();
        this._physicMeshUpdater.update();
        this._worldFactory.update();
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
