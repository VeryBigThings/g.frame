import {Vector2, Vector3} from 'three';
import {ITextViewerModuleOptions} from '@g.frame/components.text';

export enum ButtonComponentType {
    'default',
    'volumetric',
    'icon',
}

export interface IButtonComponentOptions extends ITextViewerModuleOptions {
    size: Vector3;
    sizePx?: Vector2;
    type: ButtonComponentType; // default, icon, 3d
    boxColor?: number;
    boxTransparent?: boolean;
    bordRadius?: number;
}