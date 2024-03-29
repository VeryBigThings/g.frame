export class EventDescriptor<T extends string> {
    constructor(private eventDispatcher: EventDispatcher<T>, public eventName: T, public callback: Function, public condition?: Function) {
    }

    off() {
        this.eventDispatcher.offEvent(this);
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

    on(eventName: T, callback1?: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        let descriptor;
        this.events.push(descriptor = new EventDescriptor(this, eventName, callback, condition));
        return descriptor;
    }

    once(eventName: T, callback1?: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        let savedEvent, descriptor;
        this.events.push(descriptor = new EventDescriptor(this, eventName, savedEvent = (event: ParentEvent<T>) => {
            this.off(eventName, savedEvent);
            callback(event);
        }, condition));
        return descriptor;
    }

    offEvent(eventDescriptor: EventDescriptor<T>): EventDispatcher<T> {
        this.events.splice(this.events.indexOf(eventDescriptor), 1);
        return this;
    }

    off(eventName?: T, callback?: Function) {
        if (!eventName && !callback) this.events.splice(0, this.events.length);

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
            this.events.slice().forEach(event => event.eventName === eventName && (!event.condition || (event.condition && event.condition(data, event, this))) && event.callback(data, event, this));
        }
        return this;
    }
}