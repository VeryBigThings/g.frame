import {EventDispatcher, ParentEvent} from 'g.frame.core';
import {Keyboard, KeyboardEvents} from './Keyboard';
import {Input} from './Input';

export enum InputManagerEvents {
    onFocus = 'onFocus',
    onFocusRemoved = 'onFocusRemoved',
    onFocusChanged = 'onFocusChanged',
    onType = 'onType',
    onEnter = 'onEnter',
    onRemove = 'onRemove',
}


export class InputManager extends EventDispatcher<string> {
    private readonly inputs: Array<Input> = [];
    private readonly onKeyDown: () => void;
    private readonly onKeyUp: () => void;
    private readonly onKeyPressed: () => void;
    private readonly onSymbol: (event: ParentEvent<any>) => void;
    private readonly onDelete: () => void;
    private readonly onSubmit: () => void;
    private readonly onUnFocus: () => void;

    constructor() {
        super();

        this.onKeyDown = () => {
        };
        this.onKeyUp = () => {
        };
        this.onKeyPressed = () => {
        };
        this.onSymbol = (event: ParentEvent<any>) => {
            this._currentInput?.addSymbol(event.data.key);
        };
        this.onDelete = () => {
            this._currentInput?.removeLastSymbol();
        };
        this.onSubmit = () => {
            if (this._currentInput?.enter()) {
                this.currentInput = null;
            }
        };
        this.onUnFocus = () => {
            this.currentInput = null;
        };
    }

    private _currentInput: Input;

    get currentInput(): Input {
        return this._currentInput;
    }

    set currentInput(input: Input) {
        this.inputs.forEach(inputEl => inputEl !== input && (inputEl.isFocused = false));
        this._currentInput = input;
        if (input && this.inputs.indexOf(input) === -1) this.inputs.push(input);

        this.fire('inputChanged');
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
            this._keyboard.off(null, this.onSymbol);
            this._keyboard.off(null, this.onDelete);
            this._keyboard.off(null, this.onSubmit);
            this._keyboard.off(null, this.onUnFocus);
        }
        this._keyboard = value;
        this._keyboard.on(KeyboardEvents.keyDown, this.onKeyDown);
        this._keyboard.on(KeyboardEvents.keyPressed, this.onKeyPressed);
        this._keyboard.on(KeyboardEvents.keyUp, this.onKeyUp);
        this._keyboard.on(KeyboardEvents.onEnterSymbol, this.onSymbol);
        this._keyboard.on(KeyboardEvents.onDelete, this.onDelete);
        this._keyboard.on(KeyboardEvents.onSubmit, this.onSubmit);
        this._keyboard.on(KeyboardEvents.onUnFocus, this.onUnFocus);
    }
}

