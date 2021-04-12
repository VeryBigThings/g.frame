import {EventDispatcher, ParentEvent} from '@verybigthings/g.frame.core';

export enum GamepadEvents {
    keyDown = 'keydown',
    keyUp = 'keyup',
    keyPressed = 'keypressed',
    keyTouchStart = 'keytouchstart',
    keyTouched = 'keytouched',
    keyTouchEnd = 'keytouchend',
    stickChanged = 'stickchanged',
    vibrationStart = 'vibrationstart',
    vibrationEnd = 'vibrationend',
    changed = 'changed',
}

export class AbstractGamepad extends EventDispatcher<GamepadEvents> {
    public __agentConstructor: new (...args: any[]) => AbstractGamepad;

    constructor() {
        super();
    }
}

export class GamepadAgent extends AbstractGamepad {
    constructor(private instances: Array<AbstractGamepad>) {
        super();
    }

    fire(eventName: GamepadEvents | Array<GamepadEvents>, event?: ParentEvent<GamepadEvents>) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].fire(eventName, event);
        }
        return this;
    }

    off(eventName?: GamepadEvents, callback?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].off(eventName, callback);
        }
        return this;
    }

    on(eventName: GamepadEvents, callback1?: Function, callback2?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].on(eventName, callback1, callback2);
        }
        return this;
    }

    once(eventName: GamepadEvents, callback1?: Function, callback2?: Function) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].once(eventName, callback1, callback2);
        }
        return this;
    }
}

AbstractGamepad.prototype.__agentConstructor = GamepadAgent;
