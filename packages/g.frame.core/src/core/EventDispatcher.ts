export class EventDescriptor {
    constructor(public eventName: string, public callback: Function, public condition?: Function) {}
}

export class ParentEvent {
    constructor(public eventName: string, public data?: any) {}
}

export class EventDispatcher {
    protected events: Array<EventDescriptor>;

    constructor() {
        this.events = [];
    }

    on(eventName: string, callback1: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        this.events.push(new EventDescriptor(eventName, callback, condition));
        return this;
    }

    once(eventName: string, callback1: Function, callback2?: Function) {
        const condition = callback2 ? callback1 : null;
        const callback = callback2 ? callback2 : callback1;
        let savedEvent;
        this.events.push(new EventDescriptor(eventName, savedEvent = (event: ParentEvent) => {
            this.off(eventName, savedEvent);
            callback(event);
        }, condition));
        return this;
    }

    off(eventName?: string, callback?: Function) {
        this.events.filter(event =>
            (event.eventName === eventName && !callback) ||
            (event.eventName === null && callback && event.callback === callback) ||
            (event.eventName === eventName && callback && event.callback === callback)
        ).forEach(event => this.events.splice(this.events.indexOf(event), 1));
        return this;
    }

    fire(eventName: string, data: ParentEvent = new ParentEvent('')) {
        const events = eventName.split(' ');
        if (events.length > 1)
            events.forEach(event => this.fire(event, data));
        else {
            data.eventName = eventName;
            this.events.slice().forEach(event => event.eventName === eventName && (!event.condition || (event.condition && event.condition(data))) && event.callback(data));
        }
        return this;
    }
}
