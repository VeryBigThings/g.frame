import {Factory, ParentEvent, ViewerModule} from 'g.frame.core';
import {Object3D} from 'three';
import {DepthScrollComponent} from './DepthScrollComponent';
import {IDepthScrollComponentOptions} from './DepthScrollComponent_interfaces';

export class DepthScrollComponentFactory extends Factory<DepthScrollComponent> {
    __constructor: typeof DepthScrollComponent = DepthScrollComponent;
    private components: Array<DepthScrollComponent>;

    constructor() {
        super();
        this.components = [];
    }

    get(params: IDepthScrollComponentOptions): DepthScrollComponent {
        const component = new DepthScrollComponent(params);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: DepthScrollComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}