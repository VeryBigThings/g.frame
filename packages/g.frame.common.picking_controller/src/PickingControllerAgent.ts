import {Object3D, Vector3, Quaternion} from 'three';
import {PickingController, PickingControllerEventNames} from './PickingController';
import {ParentEvent} from '@verybigthings/g.frame.core';

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

    forceRelease(controllerNumber: number = 0) {
        if (!this.enabled) return;
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].forceRelease(controllerNumber);
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

    enableSingleInstance(instance: PickingController) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].enabled = this.instances[i] === instance;
        }
    }

    disableSingleInstance(instance: PickingController) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].enabled = this.instances[i] !== instance;
        }
    }

}

PickingController.prototype.__agentConstructor = PickingControllerAgent;