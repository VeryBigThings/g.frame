import {Object3D} from 'three';
import {ObjectEventDescriptor, ObjectEventDispatcher} from './ObjectEventDispatcher';

export class MeshEventDescriptor extends ObjectEventDescriptor<Object3D> {
    constructor(public eventName: string, public object: Object3D, public callback: Function, public condition?: Function) {
        super(eventName, object, callback, condition);
    }
}

export class MeshEventDispatcher extends ObjectEventDispatcher<Object3D> {
    protected events: Array<MeshEventDescriptor> = [];
}
