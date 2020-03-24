import {WindowComponent} from './WindowComponent';
import {WindowComponentOptions} from './WindowComponent_interfaces';
import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';

export class WindowComponentFactory extends Factory<WindowComponent> {
    __constructor: typeof WindowComponent = WindowComponent;
    private components: Array<WindowComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: WindowComponentOptions): WindowComponent {
        const component = new WindowComponent(params);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: WindowComponent, disposedObject: Object3D | ViewerModule) {
        this.components.splice(this.components.indexOf(component), 1);
        this.actionController.off(null, disposedObject instanceof Object3D ? disposedObject : disposedObject.uiObject, null);
    }

    update(params: any): any {
    }
}