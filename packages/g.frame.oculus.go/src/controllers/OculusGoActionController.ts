import { Vector3, Raycaster } from 'three';
import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';

/**
 * A special config for OculusGoActionController class to store the most important options
 * Such as near/far parameters of the raycaster
 */
export interface IOculusGoActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class OculusGoActionController extends ActionController {
    protected onButtonDown: (event: any) => void;
    protected onButtonUp: (event: any) => void;
    protected onMove: (event: any) => void;

    /**
     * Initialises Oculus Go events for ActionController
     * @param config Config for the class
     * @param oculusGoController Oculus Go controller which fires the events
     */
    constructor(protected config: IOculusGoActionControllerConfig, protected oculusGoController: any) {
        super();

        // Check if they were undefined
        this.config.minRaycasterDistance = this.config.minRaycasterDistance || 0;
        this.config.maxRaycasterDistance = this.config.maxRaycasterDistance || Infinity;

        // Define the callbacks
        this.onButtonDown = (event: any) => {
            this.update(ActionControllerEventName.buttonDown, this.getRaycaster(event.position, event.direction));
        };
        this.onButtonUp = (event: any) => {
            this.update(ActionControllerEventName.buttonUp, this.getRaycaster(event.position, event.direction));
        };
        this.onMove = (event: any) => {
            this.update(ActionControllerEventName.move, this.getRaycaster(event.position, event.direction));
        };

        // Subscribe on events
        this.oculusGoController.on('buttonDown', this.onButtonDown);
        this.oculusGoController.on('buttonUp', this.onButtonUp);
        this.oculusGoController.on('move', this.onMove);
    }

    /**
     * Function to create a raycaster
     * @returns raycaster with a done ray
     */
    protected getRaycaster(position: Vector3, direction: Vector3) {
        return new Raycaster(position, direction, this.config.minRaycasterDistance, this.config.maxRaycasterDistance);
    }

    /**
     * Function to unsubscribe OculusGoActionController from all of the listened events
     */
    dispose() {
        this.oculusGoController.off('buttonDown', this.onButtonDown);
        this.oculusGoController.off('buttonUp', this.onButtonUp);
        this.oculusGoController.off('move', this.onMove);
    }
}