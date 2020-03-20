import { ActionController, IActionControllerConfig, ActionControllerEventName } from '../action_controller/ActionController';
import OculusQuestController from '../../components/gamepad/OculusQuestController';
import { VRControlsEvent } from '../vr_controls/VRControlsEvent';

export class OculusQuestActionController extends ActionController {
    protected buttonDown: (event: VRControlsEvent) => void;
    protected buttonUp: (event: VRControlsEvent) => void;
    protected move: (event: VRControlsEvent) => void;

    constructor(protected config: IActionControllerConfig, protected oculusQuestController: OculusQuestController) {
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

        this.oculusQuestController.on('buttonDown', this.buttonDown);
        this.oculusQuestController.on('buttonUp', this.buttonUp);
        this.oculusQuestController.on('move', this.move);
    }

    protected setRaycast(event: VRControlsEvent) {
        this.currentValues.forEach(controller => {
            if (controller.controllerNumber === event.controllerNumber) {
                controller.raycaster.set(event.startPosition, event.direction);
            }
        });
    }

    public dispose() {
        this.oculusQuestController.off('buttonDown', this.buttonDown);
        this.oculusQuestController.off('buttonUp', this.buttonUp);
        this.oculusQuestController.off('move', this.move);
    }
}