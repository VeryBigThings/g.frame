import { ActionController, IActionControllerConfig, ActionControllerEventName } from './ActionController';
import OculusQuestController from '../../components/gamepad/OculusQuestController';
import { VRControlsEvent } from '../vr_controls/VRControlsEvent';

export class OculusGoActionController extends ActionController {
    protected buttonDown: (event: VRControlsEvent) => void;
    protected buttonUp: (event: VRControlsEvent) => void;
    protected move: (event: VRControlsEvent) => void;

    constructor(protected config: IActionControllerConfig, protected oculusGoController: OculusQuestController) {
        super(config);

        this.buttonDown = (event: VRControlsEvent) => {
            this.setRaycast(event);
            this.update(ActionControllerEventName.buttonDown, event.controllerNumber);
        };
        this.buttonUp = (event: VRControlsEvent) => {
            this.setRaycast(event);
            this.update(ActionControllerEventName.buttonUp, event.controllerNumber);
        };
        this.move = (event: VRControlsEvent) => {
            this.setRaycast(event);
            this.update(ActionControllerEventName.move, event.controllerNumber);
        };

        this.oculusGoController.on('buttonDown', this.buttonDown);
        this.oculusGoController.on('buttonUp', this.buttonUp);
        this.oculusGoController.on('move', this.move);
    }

    protected setRaycast(event: VRControlsEvent) {
        this.currentValues.forEach(controller => {
            if (controller.controllerNumber === event.controllerNumber) {
                controller.raycaster.set(event.startPosition, event.direction);
            }
        });
    }

    public dispose() {
        this.oculusGoController.off('buttonDown', this.buttonDown);
        this.oculusGoController.off('buttonUp', this.buttonUp);
        this.oculusGoController.off('move', this.move);
    }
}