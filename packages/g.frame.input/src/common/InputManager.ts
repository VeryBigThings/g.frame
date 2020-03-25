import {EventDispatcher} from '@verybigthings/g.frame.core';
import {Keyboard, KeyboardEvents} from './Keyboard';

export enum InputManagerEvents {
    onFocus = 'onFocus',
    onFocusRemoved = 'onFocusRemoved',
    onFocusChanged = 'onFocusChanged',
    onType = 'onType',
    onEnter = 'onEnter',
    onRemove = 'onRemove',
}


export class InputManager extends EventDispatcher<string> {
    public __agentConstructor = InputManager;
    private readonly onKeyDown: () => void;
    private readonly onKeyUp: () => void;
    private readonly onKeyPressed: () => void;

    constructor() {
        super();

        this.onKeyDown = () => {
        };
        this.onKeyUp = () => {
        };
        this.onKeyPressed = () => {
        };
    }

    private _keyboard: Keyboard;

    get keyboard(): Keyboard {
        return this._keyboard;
    }

    set keyboard(value: Keyboard) {
        if (this._keyboard) {
            this._keyboard.off(null, this.onKeyDown);
            this._keyboard.off(null, this.onKeyPressed);
            this._keyboard.off(null, this.onKeyUp);
        }
        this._keyboard = value;
        this._keyboard.on(KeyboardEvents.keyDown, this.onKeyDown);
        this._keyboard.on(KeyboardEvents.keyPressed, this.onKeyPressed);
        this._keyboard.on(KeyboardEvents.keyUp, this.onKeyUp);
    }


}