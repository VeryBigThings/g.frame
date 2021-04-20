import { ActionController, ActionControllerEventName } from '@g.frame/common.action_controller';
import { Vector3, Raycaster } from 'three';

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
    protected onClick: (event: any) => void;
    protected onMove: (event: any) => void;

    /**
     * Initialises Oculus Go events for ActionController
     * @param config Config for the class
     * @param oculusGoModel Oculus Go Model which fires the events
     */
    constructor(protected config: IOculusGoActionControllerConfig, protected oculusGoModel: any) {
        super();

        // Check if they were undefined
        this.config.minRaycasterDistance = this.config.minRaycasterDistance || 0;
        this.config.maxRaycasterDistance = this.config.maxRaycasterDistance || Infinity;

        // Define the callbacks
        this.onButtonDown = (event: any) => {
            this.update(ActionControllerEventName.buttonDown, this.getRaycaster(event.data.position, event.data.direction));
        };
        this.onButtonUp = (event: any) => {
            this.update(ActionControllerEventName.buttonUp, this.getRaycaster(event.data.position, event.data.direction));
        };
        this.onClick = (event: any) => {
            this.update(ActionControllerEventName.click, this.getRaycaster(event.data.position, event.data.direction));
        };
        this.onMove = (event: any) => {
            this.update(ActionControllerEventName.move, this.getRaycaster(event.data.position, event.data.direction));
        };

        // Subscribe on events
        this.oculusGoModel.on('buttonDown', this.onButtonDown);
        this.oculusGoModel.on('buttonUp', this.onButtonUp);
        this.oculusGoModel.on('click', this.onClick);
        this.oculusGoModel.on('move', this.onMove);
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
        this.oculusGoModel.off('buttonDown', this.onButtonDown);
        this.oculusGoModel.off('buttonUp', this.onButtonUp);
        this.oculusGoModel.off('click', this.onClick);
        this.oculusGoModel.off('move', this.onMove);
    }
}