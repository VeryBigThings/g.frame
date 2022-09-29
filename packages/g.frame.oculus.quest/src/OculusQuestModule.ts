import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap, RenderModuleAbstract} from '@g.frame/core';
import {Loader} from '@g.frame/common.loaders';
import {Object3D} from 'three';
import {OculusQuestPickingController} from './OculusQuestControllers/OculusQuestPickingController';
import {OculusQuestActionController} from './OculusQuestControllers/OculusQuestActionController';
import {OculusQuestManager} from './OculusQuestManager';
import {OculusQuestModel} from './OculusQuestModel';
import {XREvent} from '@g.frame/common.xr_manager';
import {PickingController, PickingControllerAgent} from '@g.frame/common.picking_controller';
import {IOculusQuestOptions, OculusPickButton} from './interfaces';

const defaultConfig = {
    oculusQuestActionController: {
        minRaycasterDistance: 0,
        maxRaycasterDistance: Infinity
    },
    oculusQuestPickingController: {
        minPickingDistance: 0,
        maxPickingDistance: Infinity,
        controllersQuantity: 2,
        buttonToPick: OculusPickButton.SQUEEZE,
    }
};

export class OculusQuestModule extends AbstractModule {
    private _config: IOculusQuestOptions;
    private _oculusQuestManager: OculusQuestManager;
    private _actionController: OculusQuestActionController;
    private _pickingController: OculusQuestPickingController;
    private _oculusQuestModel: OculusQuestModel;
    private readonly container: Object3D;

    constructor(config?: IOculusQuestOptions) {
        super();
        this._config = config || defaultConfig;
        this._config.oculusQuestActionController = this._config.oculusQuestActionController || defaultConfig.oculusQuestActionController;
        this._config.oculusQuestPickingController = this._config.oculusQuestPickingController || defaultConfig.oculusQuestPickingController;
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
    async onInit(data: Array<AbstractModule>): Promise<Array<any>> {
        const renderModule = data.find(module => {
            return module instanceof RenderModuleAbstract;
        }) as RenderModuleAbstract;

        const viewer = renderModule.getViewer();

        this._oculusQuestModel = new OculusQuestModel(viewer);
        this._oculusQuestManager = new OculusQuestManager(viewer.renderer, this._oculusQuestModel);

        this._actionController = new OculusQuestActionController(viewer, this._config.oculusQuestActionController, this.oculusQuestModel);
        this._pickingController = new OculusQuestPickingController(viewer, this._config.oculusQuestPickingController, this.oculusQuestModel);

        // Adds view to the module container
        // this.container.add(this.oculusQuestModel.mainContainer);
        viewer.camera.parent.add(this.oculusQuestModel.mainContainer);

        return [
            this._oculusQuestManager,
            this._actionController,
            this._pickingController,
        ];
    }

    /**
     * Module after initialization.. Loads all needed resources
     */
    afterInit(agents: ConstructorInstanceMap<any>): void {
        this._oculusQuestManager.prepareResources(agents.get(Loader));

        this._oculusQuestManager.on(XREvent.goToVR, () => {
            (<PickingControllerAgent>agents.get(PickingController)).enableSingleInstance(OculusQuestPickingController);
        });
        this._oculusQuestManager.on(XREvent.goFromVR, () => {
            (<PickingControllerAgent>agents.get(PickingController)).disableSingleInstance(OculusQuestPickingController);
        });
    }

    get config(): IOculusQuestOptions {
        return this._config;
    }

    set config(value: IOculusQuestOptions) {
        console.error('You are trying to redefine instance in OculusQuestModule');
    }

    get oculusQuestModel(): OculusQuestModel {
        return this._oculusQuestModel;
    }

    set oculusQuestModel(value: OculusQuestModel) {
        console.error('You are trying to redefine instance in OculusQuestModule');
    }

    get oculusQuestManager(): OculusQuestManager {
        return this._oculusQuestManager;
    }

    set oculusQuestManager(value: OculusQuestManager) {
        console.error('You are trying to redefine instance in OculusQuestModule');
    }
    get pickingController(): OculusQuestPickingController {
        return this._pickingController;
    }

    set pickingController(value: OculusQuestPickingController) {
        console.error('You are trying to redefine instance in OculusQuestModule');
    }
    get actionController(): OculusQuestActionController {
        return this._actionController;
    }

    set actionController(value: OculusQuestActionController) {
        console.error('You are trying to redefine instance in OculusQuestModule');
    }

    /**
     * Returns module container
     */
    getModuleContainer(): Object3D {
        return this.container;
    }

    /**
     * Updates module on each frame
     */
    onUpdate(params: { currentTime: number; frame: any }): void {
        this._oculusQuestManager.manipulateModel(params);
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
