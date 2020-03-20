import {Vector3} from 'three';
import {ParentEvent} from '../core/ParentEvent';

export class VRControlsEvent extends ParentEvent {
    public direction: Vector3;

    constructor(eventName: string, public position: Vector3, public endPosition: Vector3, public controllerNumber: number = 0) {
        super(eventName);
        this.direction = this.endPosition.clone().sub(this.position).normalize();
    }
}
