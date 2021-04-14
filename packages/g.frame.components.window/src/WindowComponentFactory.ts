import {WindowComponent} from './WindowComponent';
import {WindowComponentOptions} from './WindowComponent_interfaces';
import {Factory, ParentEvent, ViewerModule} from 'g.frame.core';
import {Object3D} from 'three';

export class WindowComponentFactory extends Factory<WindowComponent> {
    __constructor: typeof WindowComponent = WindowComponent;
    private components: Array<WindowComponent>;

    constructor() {
        super();
        this.components = [];
    }

    get(params: WindowComponentOptions): WindowComponent {
        const component = new WindowComponent(params);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: WindowComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}