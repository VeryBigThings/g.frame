import {Object3D, Quaternion, Vector3} from 'three';
import {PickingController, PickingControllerEventNames} from './PickingController';
import {Constructor, ParentEvent} from '@verybigthings/g.frame.core';

export class PickingControllerAgent extends PickingController {
    public enabled: boolean = true;

    constructor(private instances: Array<PickingController>) {
        super({
            minPickingDistance: 0,
            maxPickingDistance: 0,
            controllersQuantity: 0
        });
    }

    fire(eventName: PickingControllerEventNames, mesh?: Object3D, event?: ParentEvent<PickingControllerEventNames>): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].fire(eventName, mesh, event);
        }
    }

    off(eventName?: PickingControllerEventNames, mesh?: Object3D, callback?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].off(eventName, mesh, callback);
        }
    }

    on(eventName: PickingControllerEventNames, mesh: Object3D, callback1: Function, callback2?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].on(eventName, mesh, callback1, callback2);
        }
    }

    once(eventName: PickingControllerEventNames, mesh: Object3D, callback1: Function, callback2?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].once(eventName, mesh, callback1, callback2);
        }
    }

    forcePickUp(object: Object3D, distance: number, newPosition: Vector3, newRotation: Quaternion, controllerNumber: number = 0) {
        if (!this.enabled) return;
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].forcePickUp(object, distance, newPosition, newRotation, controllerNumber);
        }
    }

    forceRelease(newPosition: Vector3, newRotation: Quaternion, isSqueezed: boolean, controllerNumber: number = 0) {
        if (!this.enabled) return;
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].forceRelease(newPosition, newRotation, isSqueezed, controllerNumber);
        }
    }

    enable() {
        this.enabled = true;
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].enabled = true;
        }
    }

    disable() {
        this.enabled = false;
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].enabled = false;
        }
    }

    enableSingleInstance<P extends PickingController>(instanceConstructor: Constructor<P>) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].enabled = Object.getPrototypeOf(this.instances[i]).constructor === instanceConstructor;
        }
    }

    disableSingleInstance<P extends PickingController>(instanceConstructor: Constructor<P>) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].enabled = Object.getPrototypeOf(this.instances[i]).constructor !== instanceConstructor;
        }
    }

}

PickingController.prototype.__agentConstructor = PickingControllerAgent;