import {ActionControllerEvent} from '../common/ActionController';
import {Object3D} from 'three';
import {PickingController, PickingControllerEvents} from '../common/PickingController';

export class PickingControllerAgent extends PickingController {

    constructor(private instances: Array<PickingController>) {
        super({
            minPickingDistance: 0,
            maxPickingDistance: 0,
            controllersQuantity: 0
        });
    }

    fire(eventName: PickingControllerEvents, mesh?: Object3D, event?: ActionControllerEvent): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].fire(eventName, mesh, event);
        }
    }

    off(eventName?: PickingControllerEvents, mesh?: Object3D, callback?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].off(eventName, mesh, callback)
        }
    }

    on(eventName: PickingControllerEvents, mesh: Object3D, callback1: Function, callback2?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].on(eventName, mesh, callback1, callback2);
        }
    }

    once(eventName: PickingControllerEvents, mesh: Object3D, callback1: Function, callback2?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].once(eventName, mesh, callback1, callback2);
        }
    }

}