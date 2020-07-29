import {Vector3, Euler, EventDispatcher} from 'three';

export class CameraControls extends EventDispatcher {
    public __agentConstructor: Function;
    public enabled: boolean = false;

    constructor() {
        super();
    }

    setPosition(newX: number, newY: number, newZ: number) {

    }

    addPosition(addedPosition: Vector3) {

    }

    getPosition(): Vector3 {
        return new Vector3();
    }

    // setOrientation(newOrientation: Euler) {
    //
    // }
    //
    // getOrientation(): Euler {
    //     return new Euler();
    // }
    //
    // setPitchDegree(newPitch: number) {
    //
    // }
    //
    // setYaw(newYaw: number) {
    //
    // }
    //
    // setRoll(newRoll: number) {
    //
    // }
}
