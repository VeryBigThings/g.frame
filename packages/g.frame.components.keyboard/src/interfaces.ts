import {Quaternion, Vector3} from 'three';
import {InputType} from 'g.frame.input';

export interface IVirtualKeyboardViewOptions {
    type: InputType;
    customWords?: Array<string>;
    position?: Vector3;
    orientation?: Quaternion;
    scale?: Vector3;
}