import {WindowComponentOptions} from '@verybigthings/g.frame.components.window';
import {
    ITextComponentOptions,
    ITextViewerModuleOptions,
    ITextViewerModuleOptionsText
} from '@verybigthings/g.frame.components.text';
import {Vector2} from 'three';
import {IInputOptions} from '@verybigthings/g.frame.input';

export interface IInputComponentOptions extends WindowComponentOptions, IInputOptions {
    label?: ITextComponentOptions;
    textComponent?: ITextViewerModuleOptions;
    pxSize?: Vector2;
    maxLength?: number;
    cursorWidth?: number;
    maskFunction?: (str1: string, str2: string) => string;
}