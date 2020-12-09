import {Factory, ParentEvent, GComponent} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {CheckRadioComponent, ICheckRadioComponentOptions} from './CheckRadioComponent';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';

export class CheckRadioComponentFactory extends Factory<CheckRadioComponent> {
    __constructor: typeof CheckRadioComponent = CheckRadioComponent;
    private components: Array<CheckRadioComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: ICheckRadioComponentOptions): CheckRadioComponent {
        const component = new CheckRadioComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: CheckRadioComponent, disposedObject: Object3D | GComponent) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}