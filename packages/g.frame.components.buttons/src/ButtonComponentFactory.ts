import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {ButtonComponent} from './ButtonComponent';
import {IButtonComponentOptions} from './ButtonComponent_interfaces';

export class ButtonComponentFactory extends Factory<ButtonComponent> {
    __constructor: typeof ButtonComponent = ButtonComponent;
    private components: Array<ButtonComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IButtonComponentOptions): ButtonComponent {
        const component = new ButtonComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: ButtonComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}