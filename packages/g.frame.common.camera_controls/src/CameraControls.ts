import {EventDispatcher, Quaternion, Vector3} from 'three';
import {Constructor} from '@verybigthings/g.frame.core';

export class CameraControls extends EventDispatcher {
    public __agentConstructor: Function;
    public enabled: boolean = false;
    public readonly platform: string;

    constructor() {
        super();
    }

    setPosition(newX: number, newY: number, newZ: number) {

    }

    copyPosition(newPosition: Vector3) {
        this.setPosition(newPosition.x, newPosition.y, newPosition.z);
    }

    addPosition(addedPosition: Vector3) {

    }

    getPosition(): Vector3 {
        return new Vector3();
    }

    setOrientation(newOrientation: Quaternion) {

    }

    getOrientation(): Quaternion {
        return new Quaternion();
    }

    setPitch(newPitch: number): void {

    }

    setYaw(newYaw: number): void {

    }

    setRoll(newRoll: number): void {

    }

    getPitch(): number {
        return 0;
    }

    getYaw(): number {
        return 0;
    }

    getRoll(): number {
        return 0;
    }


    getSpecific<T extends CameraControls>(constructorFunction: Constructor<T>): T {
        return new constructorFunction();
    }


    setPositions(positionsMap: {
        [platformName: string]: Vector3 | Array<number> | number | { x: number; y: number; z: number }
    }): void {

    }
}
