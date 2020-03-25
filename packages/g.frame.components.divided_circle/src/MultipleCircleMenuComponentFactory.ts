import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {MultipleCircleMenuComponent} from './MultipleCircleMenuComponent';
import {IMultipleCircleMenuComponent} from './interfaces';

export class MultipleCircleMenuComponentFactory extends Factory<MultipleCircleMenuComponent> {
    __constructor: typeof MultipleCircleMenuComponent = MultipleCircleMenuComponent;
    private components: Array<MultipleCircleMenuComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IMultipleCircleMenuComponent): MultipleCircleMenuComponent {
        const component = new MultipleCircleMenuComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: MultipleCircleMenuComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}