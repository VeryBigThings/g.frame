import {ActionController, ActionControllerEvent, ActionControllerEventName} from '../common/ActionController';
import {Object3D} from 'three';

export class ActionControllerAgent extends ActionController {

    constructor(private instances: Array<ActionController>) {
        super();
    }

    fire(eventName: ActionControllerEventName, mesh?: Object3D, event?: ActionControllerEvent): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].fire(eventName, mesh, event);
        }
    }

    off(eventName?: ActionControllerEventName, mesh?: Object3D, callback?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].off(eventName, mesh, callback);
        }
    }

    on(eventName: ActionControllerEventName, mesh?: Object3D, callback1?: Function, callback2?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].on(eventName, mesh, callback1, callback2);
        }
    }

    once(eventName: ActionControllerEventName, mesh?: Object3D, callback1?: Function, callback2?: Function): void {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].once(eventName, mesh, callback1, callback2);
        }
    }
}

ActionController.prototype.__agentConstructor = ActionControllerAgent;