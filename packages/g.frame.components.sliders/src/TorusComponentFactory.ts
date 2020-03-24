import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {ITorusComponentOptions, TorusComponent} from './TorusComponent';

export class TorusComponentFactory extends Factory<TorusComponent> {
    __constructor: typeof TorusComponent = TorusComponent;
    private components: Array<TorusComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: ITorusComponentOptions): TorusComponent {
        const component = new TorusComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: TorusComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}