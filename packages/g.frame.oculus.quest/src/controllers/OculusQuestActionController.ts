import {Raycaster, Vector3} from 'three';
import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.core';

/**
 * A special config for OculusQuestActionController class to store the most important options
 * Such as near/far parameters of the raycaster
 */
export interface IOculusQuestActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class OculusQuestActionController extends ActionController {
    protected onButtonDown: (event: any) => void;
    protected onButtonUp: (event: any) => void;
    protected onMove: (event: any) => void;

    /**
     * Initialises Oculus Quest events for ActionController
     * @param config Config for the class
     * @param oculusQuestController Oculus Quest controller which fires the events
     */
    constructor(protected config: IOculusQuestActionControllerConfig, protected oculusQuestController: any) {
        super();

        // Check if they were undefined
        this.config.minRaycasterDistance = this.config.minRaycasterDistance || 0;
        this.config.maxRaycasterDistance = this.config.maxRaycasterDistance || Infinity;

        // Define the callbacks
        this.onButtonDown = (event: any) => {
            this.update(ActionControllerEventName.buttonDown, this.getRaycaster(event.position, event.direction), event.controllerNumber);
        };
        this.onButtonUp = (event: any) => {
            this.update(ActionControllerEventName.buttonUp, this.getRaycaster(event.position, event.direction), event.controllerNumber);
        };
        this.onMove = (event: any) => {
            this.update(ActionControllerEventName.move, this.getRaycaster(event.position, event.direction), event.controllerNumber);
        };

        // Subscribe on events
        this.oculusQuestController.on('buttonDown', this.onButtonDown);
        this.oculusQuestController.on('buttonUp', this.onButtonUp);
        this.oculusQuestController.on('move', this.onMove);
    }

    /**
     * Function to create a raycaster
     * @returns raycaster with a done ray
     */
    protected getRaycaster(position: Vector3, direction: Vector3) {
        return new Raycaster(position, direction, this.config.minRaycasterDistance, this.config.maxRaycasterDistance);
    }

    /**
     * Function to unsubscribe OculusQuestActionController from all of the listened events
     */
    dispose() {
        this.oculusQuestController.off('buttonDown', this.onButtonDown);
        this.oculusQuestController.off('buttonUp', this.onButtonUp);
        this.oculusQuestController.off('move', this.onMove);
    }
}