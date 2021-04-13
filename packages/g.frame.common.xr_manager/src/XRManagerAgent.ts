import { XRManager, XREvent } from './XRManager';
import { ParentEvent } from 'g.frame.core';

export class XRManagerAgent extends XRManager {
    constructor(private instances: Array<XRManager>) {
        super(null);
    }

    fire(eventName: XREvent, event?: ParentEvent<XREvent>) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].fire(eventName, event);
        }
        return this;
    }

    off(eventName?: XREvent, callback?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].off(eventName, callback);
        }
        return this;
    }

    on(eventName: XREvent, callback1?: Function, callback2?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].on(eventName, callback1, callback2);
        }
        return this;
    }

    once(eventName: XREvent, callback1?: Function, callback2?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].once(eventName, callback1, callback2);
        }
        return this;
    }
}

XRManager.prototype.__agentConstructor = XRManagerAgent;