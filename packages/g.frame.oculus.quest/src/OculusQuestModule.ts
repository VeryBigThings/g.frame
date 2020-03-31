import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {Object3D} from 'three';
import {OculusQuestPickingController} from './QuestControllers/OculusQuestPickingController';
import {OculusQuestActionController} from './QuestControllers/OculusQuestActionController';
import {OculusQuestManager} from './Manager/OculusQuestManager';
import {OculusQuestModel} from './Model/OculusQuestModel';

export class OculusQuestModule extends AbstractModule {
    private oculusQuestManager: OculusQuestManager;
    private oculusQuestModel: OculusQuestModel;
    private readonly container: Object3D;

    constructor() {
        super();
        this.container = new Object3D();
        this.container.name = 'OculusQuestModuleContainer';
    }

    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: this.checkQuestBrowser() && this.checkXRSupport(),
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        // Init Model
        this.oculusQuestModel = new OculusQuestModel(data);
        this.container.add(this.oculusQuestModel.uiObject);

        // Init ActionController
        const actionController = new OculusQuestActionController(data, {
            minRaycasterDistance: 0,
            maxRaycasterDistance: Infinity
        }, this.oculusQuestModel);

        // Init PickingController
        const pickingController = new OculusQuestPickingController(data, {
            minPickingDistance: 0,
            maxPickingDistance: Infinity,
            controllersQuantity: 2,
        }, this.oculusQuestModel);

        // Init MainController
        this.oculusQuestManager = new OculusQuestManager(data.viewer.renderer, this.oculusQuestModel);

        return [
            this.oculusQuestManager,
            actionController,
            pickingController,
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.oculusQuestModel.prepareResources(agents.get(Loader));
    }

    getModuleContainer(): Object3D {
        return this.container;
    }

    /**
     * Function to update controllers on each frame
     * @param params currentTime and frame
     */
    onUpdate(params: { currentTime: number; frame: any }): void {
        this.oculusQuestManager.update(params);
    }

    onDestroy(): void {
        // Module destroy function. Use it to destroy and dispose instances.
    }

    onResume(): void {
    }

    onPause(): void {
    }

    /**
     * Function to check is Oculus Quest browser opened
     */
    checkQuestBrowser() {
        const uaToken = 'Quest';
        return !!navigator.userAgent.match(uaToken);
    }


    checkXRSupport() {
        // @ts-ignore
        return navigator?.xr?.isSessionSupported instanceof Function;
    }
}