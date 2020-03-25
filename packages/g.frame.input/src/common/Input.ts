import {ViewerModule} from '@verybigthings/g.frame.core';
import {InputManager} from './InputManager';

enum InputType {
    Numbers,
    Letters,
    Full,
    Custom
}

interface IInputOptions {
    type: InputType;
    customWords?: Array<string>;
    validation?: {
        autoValidation?: boolean;
        pattern: string;
    };
    inputManager?: InputManager;
}

export abstract class Input extends ViewerModule {
    protected constructor(public readonly options: IInputOptions, public inputManager: InputManager) {
        super();
    }

    abstract addSymbol(symbol: string): void;

    abstract removeLastSymbol(): void;

    abstract enter(): boolean;

    abstract clear(): void;

}