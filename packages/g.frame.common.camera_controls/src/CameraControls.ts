import {Vector3, Camera} from 'three';
import {MeshEventDispatcher} from '@verybigthings/g.frame.core';

export class CameraControls extends MeshEventDispatcher {
    public __agentConstructor: Function;
    public camera: Camera;

    constructor() {
        super();
    }

    setPosition(newPosition: Vector3) {

    }

    getPosition(): Vector3 {
        return new Vector3();
    }

    setOrientation(newOrientation: Vector3) {

    }

    getOrientation(): Vector3 {
        return new Vector3();
    }

    setPitchDegree(newPitch: number) {

    }

    setYaw(newYaw: number) {

    }

    setRoll(newRoll: number) {

    }
}
