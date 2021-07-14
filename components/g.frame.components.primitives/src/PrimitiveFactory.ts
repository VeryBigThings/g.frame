import {Factory, ParentEvent, ViewerModule} from '@g.frame/core';
import {Object3D} from 'three';
import {Primitive} from './Primitive';
import {PrimitiveType} from './Primitive_interfaces';


export class PrimitiveFactory extends Factory<Primitive> {
    __constructor: typeof Primitive = Primitive;
    private components: Array<Primitive>;

    constructor() {
        super();
        this.components = [];
    }

    get(type: PrimitiveType): Primitive {
        const component = new Primitive(type);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: Primitive, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}