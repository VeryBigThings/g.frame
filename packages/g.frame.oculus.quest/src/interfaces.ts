import {IPickingControllerConfig} from '@verybigthings/g.frame.common.picking_controller';
import {Quaternion, Vector3} from 'three';

/**
 * A special config for OculusQuestActionController class to store the most important options
 * Such as near/far parameters of the raycaster
 */
export interface IOculusQuestActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export interface IOculusQuestOptions {
    oculusQuestActionController?: IOculusQuestActionControllerConfig;
    oculusQuestPickingController?: IOculusQuestPickingControllerConfig;
}

export interface IOculusQuestPickingForcedState {
    left: {
        pose: Vector3;
        orientation: Quaternion;
        isSqueezed: boolean;
    };
    right: {
        pose: Vector3;
        orientation: Quaternion;
        isSqueezed: boolean;
    };
}

export interface IOculusQuestPickingControllerConfig extends IPickingControllerConfig {
    buttonToPick: OculusPickButton;
}

export enum OculusPickButton {
    TRIGGER = 'trigger', SQUEEZE = 'squeeze', ANY = 'any', BOTH = 'both'
}