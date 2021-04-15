import {EventDispatcher, ParentEvent} from '@verybigthings/g.frame.core';

export enum KeyboardEvents {
    keyDown = 'keydown',
    keyUp = 'keyup',
    keyPressed = 'keypressed',
    onSubmit = 'onsubmit',
    onDelete = 'ondelete',
    onEnterSymbol = 'onentersymbol',
    onUnFocus = 'onunfocus',
}

export class Keyboard extends EventDispatcher<KeyboardEvents> {
    public __agentConstructor: new (...args: any[]) => Keyboard;

    constructor() {
        super();
    }
}

export class KeyboardAgent extends Keyboard {
    constructor(private instances: Array<Keyboard>) {
        super();
    }

    fire(eventName: KeyboardEvents | Array<KeyboardEvents>, event?: ParentEvent<KeyboardEvents>) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].fire(eventName, event);
        }
        return this;
    }

    off(eventName?: KeyboardEvents, callback?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].off(eventName, callback);
        }
        return this;
    }

    on(eventName: KeyboardEvents, callback1?: Function, callback2?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].on(eventName, callback1, callback2);
        }
        return this;
    }

    once(eventName: KeyboardEvents, callback1?: Function, callback2?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].once(eventName, callback1, callback2);
        }
        return this;
    }
}

Keyboard.prototype.__agentConstructor = KeyboardAgent;