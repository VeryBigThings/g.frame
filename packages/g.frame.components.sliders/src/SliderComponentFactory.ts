import {Factory, ParentEvent, ViewerModule} from 'g.frame.core';
import {Object3D} from 'three';
import {ISliderComponentOptions, SliderComponent} from './SliderComponent';
import {ActionController} from 'g.frame.common.action_controller';

export class SliderComponentFactory extends Factory<SliderComponent> {
    __constructor: typeof SliderComponent = SliderComponent;
    private components: Array<SliderComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: ISliderComponentOptions): SliderComponent {
        const component = new SliderComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: SliderComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}