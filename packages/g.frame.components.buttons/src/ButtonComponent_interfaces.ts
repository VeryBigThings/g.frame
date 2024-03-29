import {Vector2, Vector3} from 'three';
import {ITextViewerModuleOptions} from '@g.frame/components.text';


export interface IButtonComponentOptions extends ITextViewerModuleOptions {
    size: Vector3;
    sizePx?: Vector2;
    type: string; // flat, icon, 3d, 3dEmpty, 3dIconEmpty
    boxColor?: number;
    boxTransparent?: boolean;
    bordRadius?: number;
}