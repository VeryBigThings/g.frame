import {Object3D} from 'three';
import {ParentEvent} from './EventDispatcher';

export class MeshEventDescriptor {
    constructor(public eventName: string, public mesh: Object3D, public callback: Function) {}
}

export class MeshEventDispatcher {
    protected events: Array<MeshEventDescriptor>;

    constructor() {
        this.events = [];
    }

    on(eventName: string, mesh: any, callback: Function) {
        this.events.push(new MeshEventDescriptor(eventName, mesh, callback));
    }

    once(eventName: string, mesh: any, callback) {
        let savedEvent;

        this.events.push(new MeshEventDescriptor(eventName, mesh, savedEvent = (event: ParentEvent) => {
            this.off(eventName, mesh, savedEvent);
            callback(event);
        }));

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
        this.events.slice().forEach(event => ((event.eventName === eventName || !eventName) && (event.mesh === mesh))
            && event.callback(data));
    }
}