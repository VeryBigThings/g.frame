import {Vector2} from 'three';
import {ITextGComponentOptions} from './TextGComponent_interfaces';

export interface ITextComponentOptions extends ITextGComponentOptions {
    size: Vector2;
    pxSize: Vector2;
}