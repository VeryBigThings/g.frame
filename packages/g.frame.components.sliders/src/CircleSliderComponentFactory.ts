import {Factory, ParentEvent, ViewerModule} from 'g.frame.core';
import {Object3D} from 'three';
import {CircleSliderComponent, ICircleSliderComponentOptions} from './CircleSliderComponent';
import {ActionController} from 'g.frame.common.action_controller';

export class CircleSliderComponentFactory extends Factory<CircleSliderComponent> {
    __constructor: typeof CircleSliderComponent = CircleSliderComponent;
    private components: Array<CircleSliderComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: ICircleSliderComponentOptions): CircleSliderComponent {
        const component = new CircleSliderComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: CircleSliderComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}