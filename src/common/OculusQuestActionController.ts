import {ActionController, ActionControllerEventName} from './ActionController';
import {VRControlsEvent} from './VRControlsEvent';
import {Raycaster, Vector3} from 'three';

export interface IOculusQuestActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class OculusQuestActionController extends ActionController {
    protected onButtonDown: (event: VRControlsEvent) => void;
    protected onButtonUp: (event: VRControlsEvent) => void;
    protected onMove: (event: VRControlsEvent) => void;

    constructor(protected config: IOculusQuestActionControllerConfig, protected oculusQuestController: any) {
        super();

        this.onButtonDown = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonDown,
                            OculusQuestActionController.getRaycaster(config, event.position, event.direction),
                                event.controllerNumber);
        };
        this.onButtonUp = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonUp,
                            OculusQuestActionController.getRaycaster(config, event.position, event.direction),
                                event.controllerNumber);
        };
        this.onMove = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.move,
                            OculusQuestActionController.getRaycaster(config, event.position, event.direction),
                                event.controllerNumber);
        };

        this.oculusQuestController.on('buttonDown', this.onButtonDown);
        this.oculusQuestController.on('buttonUp', this.onButtonUp);
        this.oculusQuestController.on('move', this.onMove);
    }

    protected static getRaycaster(config: IOculusQuestActionControllerConfig, position: Vector3, direction: Vector3) {
        return new Raycaster(position, direction, config.minRaycasterDistance, config.maxRaycasterDistance);
    }

    dispose() {
        this.oculusQuestController.off('buttonDown', this.onButtonDown);
        this.oculusQuestController.off('buttonUp', this.onButtonUp);
        this.oculusQuestController.off('move', this.onMove);
    }
}