import { ActionController, ActionControllerEventName } from './ActionController';
import { VRControlsEvent } from './VRControlsEvent';
import { Vector3, Raycaster } from 'three';

const RIGHT_CONTROLLER = 1;

export interface IOculusGoActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class OculusGoActionController extends ActionController {
    protected onButtonDown: (event: VRControlsEvent) => void;
    protected onButtonUp: (event: VRControlsEvent) => void;
    protected onMove: (event: VRControlsEvent) => void;

    constructor(protected config: IOculusGoActionControllerConfig, protected oculusGoController: any) {
        super();

        this.onButtonDown = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonDown,
                            OculusGoActionController.getRaycaster(config, event.position, event.direction),
                                RIGHT_CONTROLLER);
        };
        this.onButtonUp = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonUp,
                            OculusGoActionController.getRaycaster(config, event.position, event.direction),
                                RIGHT_CONTROLLER);
        };
        this.onMove = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.move,
                            OculusGoActionController.getRaycaster(config, event.position, event.direction),
                                RIGHT_CONTROLLER);
        };

        this.oculusGoController.on('buttonDown', this.onButtonDown);
        this.oculusGoController.on('buttonUp', this.onButtonUp);
        this.oculusGoController.on('move', this.onMove);
    }

    protected static getRaycaster(config: IOculusGoActionControllerConfig, position: Vector3, direction: Vector3) {
        return new Raycaster(position, direction, config.minRaycasterDistance, config.maxRaycasterDistance);
    }

    dispose() {
        this.oculusGoController.off('buttonDown', this.onButtonDown);
        this.oculusGoController.off('buttonUp', this.onButtonUp);
        this.oculusGoController.off('move', this.onMove);
    }
}