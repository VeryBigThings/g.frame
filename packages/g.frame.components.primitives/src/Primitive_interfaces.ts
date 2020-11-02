import {Vector2, Vector3} from 'three';
import {ITextViewerModuleOptions} from '@verybigthings/g.frame.components.text';

export enum PrimitiveType {
    BOX = 'BOX',
    CIRCLE = 'CIRCLE',
    CYLINDER = 'CYLINDER',
    PLANE = 'PLANE',
    SPHERE = 'SPHERE',
    TORUS = 'TORUS'
}

export enum PrimitiveMaterials {
    BASIC,
    LAMBERT,
    PHONG,
    PHYSIC,
    STANDARD
}

export interface IPrimitiveOptions extends ITextViewerModuleOptions {
    size: Vector3;
    sizePx?: Vector2;
    type: string; // flat, icon, 3d, 3dEmpty, 3dIconEmpty
    boxColor?: number;
    boxTransparent?: boolean;
    bordRadius?: number;
}