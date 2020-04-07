import { ParentEvent } from '@verybigthings/g.frame.core';
import { Vector3 } from 'three';

export class VRControlsEvent extends ParentEvent<string> {
    public direction: Vector3;

    constructor(eventName: string, public position: Vector3, public endPosition: Vector3, public controllerNumber: number = 0) {
        super(eventName);
        this.direction = this.endPosition.clone().sub(this.position).normalize();
    }
}
