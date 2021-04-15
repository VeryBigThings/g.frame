import {Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {ProgressbarComponent} from './ProgressbarComponent';
import {IProgressbarComponentOptions} from './ProgressbarComponent_interfaces';

export class ProgressbarComponentFactory extends Factory<ProgressbarComponent> {
    __constructor: typeof ProgressbarComponent = ProgressbarComponent;
    private components: Array<ProgressbarComponent>;

    constructor() {
        super();
        this.components = [];
    }

    get(params: IProgressbarComponentOptions): ProgressbarComponent {
        const component = new ProgressbarComponent(params);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: ProgressbarComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}