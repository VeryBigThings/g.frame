
import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import IconButtonComponent from './IconButtonComponent';
import {IIconButtonComponentOptions} from './IconButtonComponent_interfaces';

export class IconButtonComponentFactory extends Factory<IconButtonComponent, IIconButtonComponentOptions> {
    private components: Array<IconButtonComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IIconButtonComponentOptions, classConstructor: Function): IconButtonComponent {
        if (classConstructor !== IconButtonComponent) return null;

        const component = new IconButtonComponent(this.actionController, params);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: IconButtonComponent, disposedObject: Object3D | ViewerModule) {
        this.components.splice(this.components.indexOf(component), 1);
        this.actionController.off(null, disposedObject instanceof Object3D ? disposedObject : disposedObject.uiObject, null);
    }

    update(params: any): any {
    }
}