import { ActionController, IActionControllerConfig, ActionControllerEventName } from '../action_controller/ActionController';
import { ZSpaceControls } from './ZSpaceControls';
import { VRControlsEvent } from '../vr_controls/VRControlsEvent';

export class ZSpaceActionController extends ActionController {
    protected buttonDown: (event: VRControlsEvent) => void;
    protected buttonUp: (event: VRControlsEvent) => void;
    protected move: (event: VRControlsEvent) => void;

    constructor(protected config: IActionControllerConfig, protected zSpaceControls: ZSpaceControls) {
        super(config);

        this.buttonDown = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonDown, 0);
        };
        this.buttonUp = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonUp, 0);
        };
        this.move = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.move, 0);
        };

        this.zSpaceControls.on('buttonDown', this.buttonDown);
        this.zSpaceControls.on('buttonUp', this.buttonUp);
        this.zSpaceControls.on('move', this.move);
    }

    protected setRaycast(event: VRControlsEvent) {
        this.currentValues.forEach(controller => {
            if (controller.controllerNumber === event.controllerNumber) {
                controller.raycaster.set(event.startPosition, event.direction);
            }
        });
    }

    public dispose() {
        this.zSpaceControls.off('buttonDown', this.buttonDown);
        this.zSpaceControls.off('buttonUp', this.buttonUp);
        this.zSpaceControls.off('move', this.move);
    }
}