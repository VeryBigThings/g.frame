import OculusQuestController from '../../components/gamepad/OculusQuestController';
import {VRControlsEvent} from '../vr_controls/VRControlsEvent';
import {ActionController, ActionControllerEventName} from './ActionController';
import {Raycaster, Vector3} from 'three';


export interface IOculusQuestActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}


export class OculusQuestActionController extends ActionController {
    protected buttonDown: (event: VRControlsEvent) => void;
    protected buttonUp: (event: VRControlsEvent) => void;
    protected move: (event: VRControlsEvent) => void;

    constructor(protected config: IOculusQuestActionControllerConfig, protected oculusQuestController: OculusQuestController) {
        super();

        this.buttonDown = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonDown, OculusQuestActionController.getRaycaster(config, event.position, event.direction), event.controllerNumber);
        };
        this.buttonUp = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonUp, OculusQuestActionController.getRaycaster(config, event.position, event.direction), event.controllerNumber);
        };
        this.move = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.move, OculusQuestActionController.getRaycaster(config, event.position, event.direction), event.controllerNumber);
        };

        this.oculusQuestController.on('buttonDown', this.buttonDown);
        this.oculusQuestController.on('buttonUp', this.buttonUp);
        this.oculusQuestController.on('move', this.move);
    }

    static getRaycaster(config: IOculusQuestActionControllerConfig, position: Vector3, direction: Vector3) {
        return new Raycaster(position, direction, config.minRaycasterDistance, config.maxRaycasterDistance);
    }

    public dispose() {
        this.oculusQuestController.off('buttonDown', this.buttonDown);
        this.oculusQuestController.off('buttonUp', this.buttonUp);
        this.oculusQuestController.off('move', this.move);
    }
}