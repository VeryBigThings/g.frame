import {Factory, ParentEvent, ViewerModule} from '@g.frame/core';
import {Object3D} from 'three';
import {ICirclePreloader} from './interfaces';
import {CirclePreloaderComponent} from './CirclePreloaderComponent';
import {ActionController} from '@g.frame/common.action_controller';

export class CirclePreloaderComponentFactory extends Factory<CirclePreloaderComponent> {
    __constructor: typeof CirclePreloaderComponent = CirclePreloaderComponent;
    private components: Array<CirclePreloaderComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: ICirclePreloader): CirclePreloaderComponent {
        const component = new CirclePreloaderComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: CirclePreloaderComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}