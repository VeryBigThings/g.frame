import {Factory, ParentEvent, ViewerModule} from '@g.frame/core';
import {Object3D} from 'three';
import {ActionController} from '@g.frame/common.action_controller';
import UIStage from "./UIStage";
import UIStageManagerClass from "./UIStageManager";

export class UIStageFactory extends Factory<UIStage> {
    __constructor: typeof UIStage = UIStage;
    private components: Array<UIStage>;
    private actionController: ActionController;
    private uiStageManager: UIStageManagerClass;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    setStageManager(uiStageManager: UIStageManagerClass) {
        this.uiStageManager = uiStageManager;
    }

    get(stageName: string): UIStage {
        const component = new UIStage(stageName, this.uiStageManager);
        this.uiStageManager.addModule(component);
        this.components.push(component);
        // component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: UIStage, disposedObject: Object3D | ViewerModule) {
        // if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}