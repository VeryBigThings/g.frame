import {Object3D} from 'three';
import {ObjectEventDescriptor, ObjectEventDispatcher} from './ObjectEventDispatcher';

export class MeshEventDescriptor extends ObjectEventDescriptor<Object3D> {
}

export class MeshEventDispatcher extends ObjectEventDispatcher<Object3D> {
    protected events: Array<MeshEventDescriptor> = [];
}
