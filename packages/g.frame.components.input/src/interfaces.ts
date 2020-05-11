import {WindowComponentOptions} from '@verybigthings/g.frame.components.window';
import {ITextComponentOptions, ITextViewerModuleOptionsText} from '@verybigthings/g.frame.components.text';
import {Vector2} from 'three';
import {IInputOptions} from '@verybigthings/g.frame.input';

export interface IInputComponentOptions extends WindowComponentOptions, IInputOptions {
    label?: ITextComponentOptions;
    text?: ITextViewerModuleOptionsText;
    pxSize?: Vector2;
    maxLength?: number;
    maskFunction?: (str1: string, str2: string) => string;
}