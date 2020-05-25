import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import {Raycaster, Vector3} from 'three';
import {CameraControls} from '../../../g.frame.common.camera_controls/src';
import {IOculusQuestActionControllerConfig} from './OculusQuestActionController';

export interface IOculusQuestCameraControlsConfig {
    minHorizontalMoveOffset: number;
    maxHorizontalMoveOffset: number;
    minVerticalMoveOffset: number;
    maxVerticalMoveOffset: number;
}

export class OculusQuestCameraControls extends CameraControls {
    protected onButtonDown: (event: any) => void;
    protected onButtonUp: (event: any) => void;
    protected onClick: (event: any) => void;
    protected onMove: (event: any) => void;

    /**
     * Initialises Oculus Quest events for ActionController
     * @param config Config for the class
     * @param oculusQuestController Oculus Quest controller which fires the events
     */
    constructor(protected data: any, protected config: IOculusQuestCameraControlsConfig, protected oculusQuestModel: any) {
        super();

        // Check if they were undefined
        this.config.minHorizontalMoveOffset = this.config.minHorizontalMoveOffset || 0;
        this.config.maxHorizontalMoveOffset = this.config.maxHorizontalMoveOffset || Infinity;
        this.config.minVerticalMoveOffset = this.config.minVerticalMoveOffset || 0;
        this.config.maxVerticalMoveOffset = this.config.maxVerticalMoveOffset || Infinity;

        // Subscribe on events
        this.oculusQuestModel.on('buttonDown', this.onButtonDown);
        this.oculusQuestModel.on('buttonUp', this.onButtonUp);
        this.oculusQuestModel.on('click', this.onClick);
        this.oculusQuestModel.on('move', this.onMove);
    }

    /**
     * Function to unsubscribe OculusQuestActionController from all of the listened events
     */
    dispose() {
        this.oculusQuestModel.off('buttonDown', this.onButtonDown);
        this.oculusQuestModel.off('buttonUp', this.onButtonUp);
        this.oculusQuestModel.off('click', this.onClick);
        this.oculusQuestModel.off('move', this.onMove);
    }
}