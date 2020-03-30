import { AbstractModule, AbstractModuleStatus } from '@verybigthings/g.frame.core';
import { OculusQuestPickingController } from './QuestControllers/OculusQuestPickingController';
import { OculusQuestActionController } from './QuestControllers/OculusQuestActionController';
import { OculusQuestController } from './Controller/OculusQuestController';
import { OculusQuestModel } from './Model/OculusQuestModel';
import { Object3D } from 'three';

export class OculusQuestModule extends AbstractModule {
    private oculusQuestController: OculusQuestController;
    private readonly container: Object3D;

    constructor() {
        super();
        this.container = new Object3D();
        this.container.name = 'OculusQuestModuleContrainer';
    }

    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: this.checkQuestBrowser()
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        // Init ActionController
        const actionController = new OculusQuestActionController(data, {
                minRaycasterDistance: 0,
                maxRaycasterDistance: Infinity
        }, OculusQuestModel.getInstance(data));

        // Init PickingController
        const pickingController = new OculusQuestPickingController(data, {
            minPickingDistance: 0,
            maxPickingDistance: Infinity,
            controllersQuantity: 2,
        }, OculusQuestModel.getInstance());

        // Init MainController
        this.oculusQuestController = new OculusQuestController(data, OculusQuestModel.getInstance());

        const a = OculusQuestModel.getInstance();
        data.viewer.scene.add(a.uiObject);

        // Return the controllers ???
        return [
            this.oculusQuestController,
            actionController,
            pickingController,
        ];
    }

    afterInit(): void {
        // Module after initialization. Here you can start save the World.
    }

    onResourcesReady(): void {
        this.oculusQuestController.initView();
    }

    /**
     * Function to update controllers on each frame
     * @param params currentTime and frame
     */
    onUpdate(params: { currentTime: number; frame: any }): void {
        this.oculusQuestController.update(params);
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
}