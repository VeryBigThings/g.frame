import {Vector3, Euler, Object3D} from 'three';

export class CameraControls extends EventDispatcher {
    public __agentConstructor: Function;

    constructor(private camera?: Object3D) {
        super();
    }

    setPosition(newPosition: Vector3) {

    }

    addPosition(addedPosition: Vector3) {

    }

    getPosition(): Vector3 {
        return new Vector3();
    }

    setOrientation(newOrientation: Vector3) {

    }

    getOrientation(): Euler {
        return new Euler();
    }

    setPitchDegree(newPitch: number) {

    }

    setYaw(newYaw: number) {

    }

    setRoll(newRoll: number) {

    }
}
