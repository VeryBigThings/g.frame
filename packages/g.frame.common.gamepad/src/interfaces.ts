import {Vector2} from 'three';

export interface IGamepadStick extends IGamepadButton {
    axes: Vector2;
}

export interface IGamepadButton {
    touched: boolean;
    clicked: boolean;
    pressed: boolean;
    value: number;
}

export interface IGamepadModel {
    enabled: boolean;
    stickLeft: IGamepadStick; // 10
    stickRight: IGamepadStick; // 11
    l1: IGamepadButton; // 4
    r1: IGamepadButton; // 5
    l2: IGamepadButton; // 6
    r2: IGamepadButton; // 7
    left: IGamepadButton; // 14
    top: IGamepadButton; // 12
    right: IGamepadButton; // 15
    down: IGamepadButton; // 13
    cross: IGamepadButton; // 0
    circle: IGamepadButton; // 1
    triangle: IGamepadButton; // 3
    square: IGamepadButton; // 2
    touchpad: IGamepadButton; // 17
    share: IGamepadButton; // 8
    options: IGamepadButton; // 9
    ps: IGamepadButton; // 16
}
