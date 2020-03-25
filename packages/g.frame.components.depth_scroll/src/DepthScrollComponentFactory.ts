import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {DepthScrollComponent} from './DepthScrollComponent';
import {IDepthScrollComponentOptions} from './DepthScrollComponent_interfaces';

export class DepthScrollComponentFactory extends Factory<DepthScrollComponent> {
    __constructor: typeof DepthScrollComponent = DepthScrollComponent;
    private components: Array<DepthScrollComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IDepthScrollComponentOptions): DepthScrollComponent {
        const component = new DepthScrollComponent(params);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: DepthScrollComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}