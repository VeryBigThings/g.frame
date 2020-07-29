import {Vector3, Euler, EventDispatcher, Object3D} from 'three';
import {CameraControls} from './CameraControls';

export class CameraWrapperControls extends CameraControls {
    public __agentConstructor: Function;

    constructor(public wrapper: Object3D) {
        super();
    }

    setPosition(newX: number, newY: number, newZ: number) {
        if (this.enabled === false) return;
        const oldPos = this.wrapper.position.clone();
        this.wrapper.position.set(newX ||  oldPos.x, newY ||  oldPos.y, newZ ||  oldPos.z);
    }

    addPosition(addedPosition: Vector3) {
        if (this.enabled === false) return;
        this.wrapper.position.add(addedPosition);
    }

    getPosition(): Vector3 {
        if (this.enabled === false) return;
        return this.wrapper.position.clone();
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