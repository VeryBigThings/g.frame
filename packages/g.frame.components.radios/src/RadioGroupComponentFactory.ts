import {Factory, ParentEvent, GComponent} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {IRadioGroupComponentOptions, RadioGroupComponent} from './RadioGroupComponent';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';


export class RadioGroupComponentFactory extends Factory<RadioGroupComponent> {
    __constructor: typeof RadioGroupComponent = RadioGroupComponent;
    private components: Array<RadioGroupComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IRadioGroupComponentOptions): RadioGroupComponent {
        const component = new RadioGroupComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: RadioGroupComponent, disposedObject: Object3D | GComponent) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}