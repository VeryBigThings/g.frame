import {Factory, ParentEvent, GframeModule} from '@g.frame/core';
import {Object3D} from 'three';
import {DropdownComponent} from './DropdownComponent';
import { IDropdownComponentOptions } from './DropdownComponent_interfaces';
import {ActionController} from '@g.frame/common.action_controller';

export class DropdownComponentFactory extends Factory<DropdownComponent> {
    __constructor: typeof DropdownComponent = DropdownComponent;
    private components: Array<DropdownComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IDropdownComponentOptions): DropdownComponent {
        const component = new DropdownComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: DropdownComponent, disposedObject: Object3D | GframeModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}