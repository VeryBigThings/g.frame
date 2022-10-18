import {Factory, ParentEvent, GframeModule} from '@g.frame/core';
import {Object3D} from 'three';
import {IconButtonComponent} from './IconButtonComponent';
import {IIconButtonComponentOptions} from './IconButtonComponent_interfaces';
import {ActionController} from '@g.frame/common.action_controller';

export class IconButtonComponentFactory extends Factory<IconButtonComponent> {
    __constructor: typeof IconButtonComponent = IconButtonComponent;
    private components: Array<IconButtonComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IIconButtonComponentOptions): IconButtonComponent {
        const component = new IconButtonComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: IconButtonComponent, disposedObject: Object3D | GframeModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}