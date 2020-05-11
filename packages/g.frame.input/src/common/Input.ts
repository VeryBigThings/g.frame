import {EventDispatcher} from '@verybigthings/g.frame.core';
import {InputManager} from './InputManager';

export enum InputType {
    Numbers,
    Letters,
    Full,
    Custom
}

export interface IInputOptions {
    type: InputType;
    customWords?: Array<string>;
    validation?: {
        autoValidation?: boolean;
        pattern: string;
    };
    inputManager?: InputManager;
}

export abstract class Input extends EventDispatcher<string> {
    protected constructor(public readonly options: IInputOptions, public inputManager: InputManager) {
        super();
    }

    public _isFocused: boolean = false;

    get isFocused(): boolean {
        return this._isFocused;
    }

    set isFocused(value: boolean) {
        this._isFocused = value;
        this.fire('focusChanged');
    }

    abstract addSymbol(symbol: string): void;

    abstract removeLastSymbol(): void;

    abstract enter(): boolean;

    abstract clear(): void;

}