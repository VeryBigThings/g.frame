export class EventDescriptor<T extends string> {
    constructor(public eventName: T, public callback: Function, public condition?: Function) {
    }
}

export class ParentEvent<T extends string> {
    constructor(public eventName: T = null, public data?: any) {
    }
}

export class EventDispatcher<T extends string> {
    protected events: Array<EventDescriptor<T>>;

    constructor() {
        this.events = [];
    }

    on(eventName: T, callback1: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        this.events.push(new EventDescriptor(eventName, callback, condition));
        return this;
    }

    once(eventName: T, callback1: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        let savedEvent;
        this.events.push(new EventDescriptor(eventName, savedEvent = (event: ParentEvent<T>) => {
            this.off(eventName, savedEvent);
            callback(event);
        }, condition));
        return this;
    }

    off(eventName?: T, callback?: Function) {
        this.events.filter(event =>
            (event.eventName === eventName && !callback) ||
            (event.eventName === null && callback && event.callback === callback) ||
            (event.eventName === eventName && callback && event.callback === callback)
        ).forEach(event => this.events.splice(this.events.indexOf(event), 1));
        return this;
    }

    fire(eventName: T | Array<T>, data: ParentEvent<T> = new ParentEvent<T>()) {
        if (eventName instanceof Array) {
            eventName.forEach(event => this.fire(event, data));
        } else {
            data.eventName = eventName;
            this.events.slice().forEach(event => event.eventName === eventName && (!event.condition || (event.condition && event.condition(data))) && event.callback(data));
        }
        return this;
    }
}
