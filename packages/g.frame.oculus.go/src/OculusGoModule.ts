import { AbstractModule, AbstractModuleStatus, ConstructorInstanceMap } from '@verybigthings/g.frame.core';
import { Loader } from '@verybigthings/g.frame.common.loaders';
import { Object3D } from 'three';
import { OculusGoActionController } from './OculusGoControllers/OculusGoActionController';
import { OculusGoManager } from './OculusGoManager';
import { OculusGoModel } from './OculusGoModel';
import {CameraWrapperControls} from '@verybigthings/g.frame.common.camera_controls';

export class OculusGoModule extends AbstractModule {
    public oculusGoManager: OculusGoManager;
    private readonly container: Object3D;

    constructor() {
        super();
        this.container = new Object3D();
        this.container.name = 'OculusGoModuleContainer';
    }

    /**
     * Module pre initialization.. Just make sure, that module is supported.
     */
    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: this.checkGoBrowser() && this.checkXRSupport(),
        };
    }

    /**
     * Module initialization.. Inits main actionController. Inits Oculus Quest model and manager
     */
    async onInit(data: any): Promise<Array<any>> {
        const oculusGoModel = new OculusGoModel(data.viewer);
        this.oculusGoManager = new OculusGoManager(data.viewer.renderer, oculusGoModel);

        const actionController = new OculusGoActionController({
            minRaycasterDistance: 0,
            maxRaycasterDistance: Infinity
        }, oculusGoModel);

        // Adds view to the module container
        this.container.add(oculusGoModel.mainContainer);

        return [
            this.oculusGoManager,
            actionController,
            new CameraWrapperControls(data.viewer.cameraWrap)
        ];
    }

    /**
     * Module after initialization.. Loads all needed resources
     */
    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.oculusGoManager.prepareResources(agents.get(Loader));
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
        this.oculusGoManager.manipulateModel(params);
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
    private checkGoBrowser() {
        const uaToken = 'Pacific';
        return !!navigator.userAgent.match(uaToken);
    }

    /**
     * Checks if XR session is supported
     */
    private checkXRSupport() {
        // @ts-ignore
        return navigator?.xr?.isSessionSupported instanceof Function;
    }
}