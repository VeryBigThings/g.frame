import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {Object3D} from 'three';
import {OculusQuestPickingController} from './OculusQuestControllers/OculusQuestPickingController';
import {OculusQuestActionController} from './OculusQuestControllers/OculusQuestActionController';
import {InputSourceManager} from './InputSourceManager';
import {OculusQuestModel} from './OculusQuestModel';
import { OculusQuestViewChanger } from './View/OculusQuestViewChanger';

export class OculusQuestModule extends AbstractModule {
    public inputSourceManager: InputSourceManager;
    public oculusQuestViewChanger: OculusQuestViewChanger;
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
        const oculusQuestModel = new OculusQuestModel(data);

        // Init ViewChanger
        this.oculusQuestViewChanger = new OculusQuestViewChanger(oculusQuestModel);
        this.oculusQuestViewChanger.setCurrentView();

        // Init ActionController
        const actionController = new OculusQuestActionController(data, {
            minRaycasterDistance: 0,
            maxRaycasterDistance: Infinity
        }, oculusQuestModel);

        // Init PickingController
        const pickingController = new OculusQuestPickingController(data, {
            minPickingDistance: 0,
            maxPickingDistance: Infinity,
            controllersQuantity: 2,
        }, oculusQuestModel);

        // Init Manager
        this.inputSourceManager = new InputSourceManager(data.viewer.renderer, oculusQuestModel);
        this.container.add(oculusQuestModel.mainContainer);

        return [
            this.inputSourceManager,
            actionController,
            pickingController,
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.oculusQuestViewChanger.prepareResources(agents.get(Loader));
    }

    getModuleContainer(): Object3D {
        return this.container;
    }

    /**
     * Function to update gamepads on each frame
     * @param params currentTime and frame
     */
    onUpdate(params: { currentTime: number; frame: any }): void {
        this.inputSourceManager.manipulateModel(params);
    }

    onDestroy(): void {
        // Module destroy function. Use it to destroy and dispose instances.
    }

    onResume(): void {
    }

    onPause(): void {
    }

    checkQuestBrowser() {
        const uaToken = 'Quest';
        return !!navigator.userAgent.match(uaToken);
    }

    checkXRSupport() {
        // @ts-ignore
        return navigator?.xr?.isSessionSupported instanceof Function;
    }
}