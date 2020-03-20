import { ActionController, ActionControllerEventName } from './ActionController';
import { VRControlsEvent } from './VRControlsEvent';
import { Vector3, Raycaster } from 'three';

/**
 * A special config for ZSpaceActionController class to store the most important options
 * Such as near/far parameters of the raycaster
 */
export interface IZSpaceActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class ZSpaceActionController extends ActionController {
    protected onButtonDown: (event: VRControlsEvent) => void;
    protected onButtonUp: (event: VRControlsEvent) => void;
    protected onMove: (event: VRControlsEvent) => void;

    constructor(protected config: IZSpaceActionControllerConfig, protected zSpaceControls: any) {
        super();

        // Check if they were undefined
        this.config.minRaycasterDistance = this.config.minRaycasterDistance || 0;
        this.config.maxRaycasterDistance = this.config.maxRaycasterDistance || Infinity;

        // Define the callbacks
        this.onButtonDown = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonDown, this.getRaycaster(event.position, event.direction));
        };
        this.onButtonUp = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonUp, this.getRaycaster(event.position, event.direction));
        };
        this.onMove = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.move, this.getRaycaster(event.position, event.direction));
        };

        // Subscribe on events
        this.zSpaceControls.on('buttonDown', this.onButtonDown);
        this.zSpaceControls.on('buttonUp', this.onButtonUp);
        this.zSpaceControls.on('move', this.onMove);
    }

    /**
     * 
     * @param config 
     * @param position 
     * @param direction 
     */
    protected getRaycaster(position: Vector3, direction: Vector3) {
        return new Raycaster(position, direction, this.config.minRaycasterDistance, this.config.maxRaycasterDistance);
    }

    /**
     * Function to unsubscribe ZSpaceActionController from all the events
     */
    dispose() {
        this.zSpaceControls.off('buttonDown', this.onButtonDown);
        this.zSpaceControls.off('buttonUp', this.onButtonUp);
        this.zSpaceControls.off('move', this.onMove);
    }
}