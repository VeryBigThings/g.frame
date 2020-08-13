import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {Object3D} from 'three';
import {
    OculusQuestPickingController,
    OculusPickButton,
    IOculusQuestPickingControllerConfig
} from './OculusQuestControllers/OculusQuestPickingController';
import {
    IOculusQuestActionControllerConfig,
    OculusQuestActionController
} from './OculusQuestControllers/OculusQuestActionController';
import {OculusQuestManager} from './OculusQuestManager';
import {OculusQuestModel} from './OculusQuestModel';
import {XREvent} from '@verybigthings/g.frame.common.xr_manager';
import {
    IPickingControllerConfig,
    PickingController,
    PickingControllerAgent
} from '@verybigthings/g.frame.common.picking_controller';

interface IOculusQuestOptions {
    mouseActionController?: IOculusQuestActionControllerConfig;
    mousePickingController?: IOculusQuestPickingControllerConfig;
}

const defaultConfig = {
    mouseActionController: {
        minRaycasterDistance: 0,
        maxRaycasterDistance: Infinity
    },
    mousePickingController: {
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
    private readonly container: Object3D;

    constructor(config?: IOculusQuestOptions) {
        super();
        this.config = config || defaultConfig;
        this.config.mouseActionController = this.config.mouseActionController || defaultConfig.mouseActionController;
        this.config.mousePickingController = this.config.mousePickingController || defaultConfig.mousePickingController;
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

        const actionController = new OculusQuestActionController(data, this.config.mouseActionController, oculusQuestModel);

        this.pickingController = new OculusQuestPickingController(data, this.config.mousePickingController, oculusQuestModel);

        // Adds view to the module container
        this.container.add(oculusQuestModel.mainContainer);

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
            (<PickingControllerAgent>agents.get(PickingController)).enableSingleInstance(this.pickingController);
        });
        this.oculusQuestManager.on(XREvent.goFromVR, () => {
            (<PickingControllerAgent>agents.get(PickingController)).disableSingleInstance(this.pickingController);
        });
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