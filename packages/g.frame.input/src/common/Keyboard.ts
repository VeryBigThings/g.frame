import {EventDispatcher} from '@verybigthings/g.frame.core';

export enum KeyboardEvents {
    keyDown = 'keydown',
    keyUp = 'keyup',
    keyPressed = 'keypressed'
}

export class Keyboard extends EventDispatcher<KeyboardEvents> {
    public __agentConstructor: new (...args: any[]) => Keyboard;

    constructor() {
        super();
    }
}