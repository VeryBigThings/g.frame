import {Vector2} from 'three';
import {ITextViewerModuleOptions} from './TextViewerModule_interfaces';

export interface ITextComponentOptions extends ITextViewerModuleOptions {
    size: Vector2;
    pxSize: Vector2;
}