import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {Object3D} from 'three';
import {OculusQuestPickingController} from './OculusQuestControllers/OculusQuestPickingController';
import {OculusQuestActionController} from './OculusQuestControllers/OculusQuestActionController';
import {OculusQuestManager} from './OculusQuestManager';
import {OculusQuestModel} from './OculusQuestModel';
import {XREvent} from '@verybigthings/g.frame.common.xr_manager';
import {PickingController, PickingControllerAgent} from '@verybigthings/g.frame.common.picking_controller';
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
    public oculusQuestManager: OculusQuestManager;
    public pickingController: OculusQuestPickingController;
    public config: IOculusQuestOptions;
    private _oculusQuestModel: OculusQuestModel;
    private readonly container: Object3D;

    constructor(config?: IOculusQuestOptions) {
        super();
        this.config = config || defaultConfig;
        this.config.oculusQuestActionController = this.config.oculusQuestActionController || defaultConfig.oculusQuestActionController;
        this.config.oculusQuestPickingController = this.config.oculusQuestPickingController || defaultConfig.oculusQuestPickingController;
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
        this._oculusQuestModel = new OculusQuestModel(data);
        this.oculusQuestManager = new OculusQuestManager(data.viewer.renderer, this._oculusQuestModel);

        const actionController = new OculusQuestActionController(data, this.config.oculusQuestActionController, this.oculusQuestModel);

        this.pickingController = new OculusQuestPickingController(data, this.config.oculusQuestPickingController, this.oculusQuestModel);

        // Adds view to the module container
        this.container.add(this._oculusQuestModel.mainContainer);

        return [
            this.oculusQuestManager,
            actionController,
            this.pickingController,
        ];
    }

    /**
     * Module after initialization.. Loads all needed resources
     */
    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.oculusQuestManager.prepareResources(agents.get(Loader));

        this.oculusQuestManager.on(XREvent.goToVR, () => {
            (<PickingControllerAgent>agents.get(PickingController)).enableSingleInstance(OculusQuestPickingController);
        });
        this.oculusQuestManager.on(XREvent.goFromVR, () => {
            (<PickingControllerAgent>agents.get(PickingController)).disableSingleInstance(OculusQuestPickingController);
        });
    }

    get oculusQuestModel(): OculusQuestModel {
        return this._oculusQuestModel;
    }

    set oculusQuestModel(value: OculusQuestModel) {
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
