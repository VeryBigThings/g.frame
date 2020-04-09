import {Object3D} from 'three';
import {EventDispatcher} from '@verybigthings/g.frame.core/build/main';

export enum XRViewStatus {
    PREPARING,
    READY,
    ERROR
}

export enum XRControllerModelEvents {
    move = 'move',
    buttonDown = 'buttonDown',
    buttonUp = 'buttonUp',
    click = 'click',
    controllerChanged = 'controllerChanged'
}

export interface IXRControllerModel extends EventDispatcher<XRControllerModelEvents> {
    manipulateModel: (...args: any[]) => void;
    mainContainer: Object3D;
    updateView: (newXRControllerView?: IXRControllerView) => void;
}

export enum ControllerHandnessCodes {
    NONE = 0,
    LEFT = 0,
    RIGHT = 1
}

export interface IXRControllerView {
    uiObject: Object3D;
    getStatus: () => XRViewStatus;

    updateView(viewModel: IXRControllerModel): void;

    hideView(code: ControllerHandnessCodes): void;
}