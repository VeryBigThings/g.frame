import {Object3D} from 'three';
import {ParentEvent} from './EventDispatcher';

export class MeshEventDescriptor {
    constructor(public eventName: string, public mesh: Object3D, public callback: Function, public condition?: Function) {
    }
}

export class MeshEventDispatcher {
    protected events: Array<MeshEventDescriptor>;

    constructor() {
        this.events = [];
    }

    on(eventName: string, mesh, callback1: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        this.events.push(new MeshEventDescriptor(eventName, mesh, callback, condition));
    }

    once(eventName: string, mesh, callback1: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        let savedEvent;
        this.events.push(new MeshEventDescriptor(eventName, mesh, savedEvent = (event: ParentEvent) => {
            this.off(eventName, mesh, savedEvent);
            callback(event);
        }, condition));
        return savedEvent;
    }

    off(eventName?: string, mesh?: Object3D, callback?: Function) {
        this.events.filter(event =>
            (event.eventName === eventName || !eventName) &&
            (event.mesh === mesh || !mesh) &&
            (event.callback === callback || !callback)
        ).forEach(event => this.events.splice(this.events.indexOf(event), 1));
    }

    fire(eventName?: string, mesh?: Object3D, data: ParentEvent = new ParentEvent('')) {
        data.eventName = eventName;
        this.events.slice().forEach(event => ((event.eventName === eventName || !eventName) && (event.mesh === mesh) && (!event.condition || (event.condition && event.condition(data))))
            && event.callback(data));
    }

}
