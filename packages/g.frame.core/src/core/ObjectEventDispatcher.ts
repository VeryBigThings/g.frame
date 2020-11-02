import {ParentEvent} from './EventDispatcher';

export class ObjectEventDescriptor <T> {
    constructor(public eventName: string, public object: T, public callback: Function, public condition?: Function) {
    }
}

export class ObjectEventDispatcher <T> {
    protected events: Array<ObjectEventDescriptor<T>>;

    constructor() {
        this.events = [];
    }

    on(eventName: string, object: T, callback1: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        this.events.push(new ObjectEventDescriptor<T>(eventName, object, callback, condition));
    }

    once(eventName: string, object: T, callback1: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        let savedEvent;
        this.events.push(new ObjectEventDescriptor<T>(eventName, object, savedEvent = (event: ParentEvent<string>) => {
            this.off(eventName, object, savedEvent);
            callback(event);
        }, condition));
        return savedEvent;
    }

    off(eventName?: string, object?: T, callback?: Function) {
        this.events.filter(event =>
            (event.eventName === eventName || !eventName) &&
            (event.object === object || !object) &&
            (event.callback === callback || !callback)
        ).forEach(event => this.events.splice(this.events.indexOf(event), 1));
    }

    fire(eventName?: string, object?: T, data: ParentEvent<string> = new ParentEvent<string>('')) {
        data.eventName = eventName;
        this.events.slice().forEach(event => ((event.eventName === eventName || !eventName) && (event.object === object) && (!event.condition || (event.condition && event.condition(data))))
            && event.callback(data));
    }

}
