import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@g.frame/core';
import {ActionController} from '@g.frame/common.action_controller';
import UIStageManagerClass from "./UIStageManager";
import {UIStageFactory} from "./UIStageFactory";
import {Loader} from "@g.frame/common.loaders";
import {TextComponentFactory} from "@g.frame/components.text";

export class UIModule extends AbstractModule {
    private uiStageFactory: UIStageFactory;
    private uiStageManager: UIStageManagerClass;

    constructor() {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        // console.info('Module pre initialization.. Just make sure, that module is supported.');
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        this.uiStageManager = new UIStageManagerClass();

        this.uiStageFactory = new UIStageFactory();
        this.uiStageFactory.setStageManager(this.uiStageManager);
        return [
            this.uiStageFactory,
            this.uiStageManager
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        const actionController = agents.get(ActionController);
        this.uiStageManager.setModules(agents.get(Loader), agents.get(ActionController), agents.get(TextComponentFactory));
        this.uiStageFactory.setActionController(actionController);
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
    }

    onDestroy(): void {
        // console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}