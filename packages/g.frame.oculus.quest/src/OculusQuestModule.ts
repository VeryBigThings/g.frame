import { AbstractModule, AbstractModuleStatus, ConstructorInstanceMap } from '@verybigthings/g.frame.core';
import { Loader } from '@verybigthings/g.frame.common.loaders';
import { Object3D } from 'three';
import { OculusQuestPickingController } from './OculusQuestControllers/OculusQuestPickingController';
import { OculusQuestActionController } from './OculusQuestControllers/OculusQuestActionController';
import { OculusQuestManager } from './OculusQuestManager';
import { OculusQuestModel } from './OculusQuestModel';
import {Locomotion, Teleport} from './OculusQuestControllers/OculusQuestCameraControls';

export class OculusQuestModule extends AbstractModule {
    public oculusQuestManager: OculusQuestManager;
    public readonly container: Object3D;

    constructor() {
        super();
        this.container = new Object3D();
        this.container.name = 'OculusQuestModuleContainer';
    }

    /**
     * Module pre initialization.. Just make sure, that module is supported.
     */
    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: this.checkQuestBrowser() && this.checkXRSupport(),
        };
    }

    /**
     * Module initialization.. Inits main controllers. Inits Oculus Quest model and manager
     */
    async onInit(data: any): Promise<Array<any>> {
        const oculusQuestModel = new OculusQuestModel(data);
        this.oculusQuestManager = new OculusQuestManager(data.viewer.renderer, oculusQuestModel);

        const actionController = new OculusQuestActionController(data, {
            minRaycasterDistance: 0,
            maxRaycasterDistance: Infinity
        }, oculusQuestModel);

        const pickingController = new OculusQuestPickingController(data, {
            minPickingDistance: 0,
            maxPickingDistance: Infinity,
            controllersQuantity: 2,
        }, oculusQuestModel);

        // data.viewer.scene.add(locomotion.waypoint.container);

        // Adds view to the module container
        this.container.add(oculusQuestModel.mainContainer);
        data.viewer.cameraWrap.add(this.container);

        return [
            this.oculusQuestManager,
            actionController,
            pickingController,
        ];
    }

    /**
     * Module after initialization.. Loads all needed resources
     */
    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.oculusQuestManager.prepareResources(agents.get(Loader));
    }

    /**
     * Returns module container
     */
    getContainer(): Object3D {
        return this.container;
    }

    /**
     * Returns module container for adding to scene in ScenarioProcessor
     */

    getModuleContainer(): Object3D | void {
        return undefined;
    }

    /**
     * Updates module on each frame
     */
    onUpdate(params: { currentTime: number; frame: any }): void {
        this.oculusQuestManager.manipulateModel(params);
    }

    onDestroy(): void {
    }

    onResume(): void {
    }

    onPause(): void {
    }

    /**
     * Checks if Oculus Quest Browser is being used
     */
    checkQuestBrowser() {
        const uaToken = 'Quest';
        return !!navigator.userAgent.match(uaToken);
    }

    /**
     * Checks if XR session is supported
     */
    checkXRSupport() {
        // @ts-ignore
        return navigator?.xr?.isSessionSupported instanceof Function;
    }
}