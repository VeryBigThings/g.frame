import {Factory, ParentEvent, GComponent} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {DividedCircleComponent} from './DividedCircleComponent';
import {IDividedCircleMenu} from './interfaces';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';

export class DividedCircleComponentFactory extends Factory<DividedCircleComponent> {
    __constructor: typeof DividedCircleComponent = DividedCircleComponent;
    private components: Array<DividedCircleComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IDividedCircleMenu): DividedCircleComponent {
        const component = new DividedCircleComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: DividedCircleComponent, disposedObject: Object3D | GComponent) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}