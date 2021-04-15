import {IPickingControllerConfig} from '@verybigthings/g.frame.common.picking_controller';

/**
 * A special config for MouseActionController to store the most important options
 * such as near/far parameters of the raycaster
 */
export interface IMouseActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export interface IDesktopOptions {
    mouseActionController?: IMouseActionControllerConfig;
    mousePickingController?: IMousePickingControllerConfig;
}

export interface IMousePickingControllerConfig extends IPickingControllerConfig {
    offSet?: number;
}