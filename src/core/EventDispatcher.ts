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

    /**
     * Method for subscribing to event
     * @param eventName Name of event
     * @param callback Callback function
     */
    on(eventName: string, callback: Function) {
        this.events.push(new EventDescriptor(eventName, callback));
        return this;
    }

    /**
     * Method for subscribing to event, but callback will be called only one time and will automatically unsubscribe.
     * @param eventName Name of event
     * @param callback Callback function
     */
    once(eventName: string, callback: Function) {
        let savedEvent;
        this.events.push(new EventDescriptor(eventName, savedEvent = (event: ParentEvent) => {
            this.off(eventName, savedEvent);
            callback(event);
        }));
        return this;
    }

    /**
     * Method for unsubscribing.
     */
    off(eventName?: string, callback?: Function) {
        this.events.filter(event =>
            (event.eventName === eventName && !callback) ||
            (event.eventName === null && callback && event.callback === callback) ||
            (event.eventName === eventName && callback && event.callback === callback)
        ).forEach(event => this.events.splice(this.events.indexOf(event), 1));
        return this;
    }

    /**
     * Method for calling all listeners.
     * @param eventName
     * @param data
     */
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
