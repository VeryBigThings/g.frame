import {ParentEvent} from '@verybigthings/g.frame.core';
import {PickingControllerEventNames} from './PickingController';
import { Object3D, Raycaster, Vector3, Quaternion } from 'three';

export class PickingControllerEvent extends ParentEvent<any> {
    constructor(public eventName: PickingControllerEventNames, public data: IPickingControllerEventData) {
        super(eventName, data);
    }
}

export interface IPickingControllerEventData {
    currentValue: IPickingControllerCurrentValue;
    controllerNumber: number;
}

export interface IPickingControllerCurrentValue {
    currentPickedObject: Object3D;
    raycaster: Raycaster;
    intersectionDistance: number;
    startScale: Vector3;
    startOffset: Vector3;
    startRotation: Quaternion;
}

export interface IPickingControllerConfig {
    minPickingDistance: number;
    maxPickingDistance: number;
    controllersQuantity: number;
}