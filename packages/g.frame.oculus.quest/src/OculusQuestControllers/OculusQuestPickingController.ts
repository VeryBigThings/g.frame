import {PickingController} from '@g.frame/common.picking_controller';
import {XRControllerModelEvents} from '@g.frame/common.xr_manager';
import {Object3D, Quaternion, Vector3} from 'three';
import {IOculusQuestControllersModel, OculusQuestModel} from '../OculusQuestModel';
import {IOculusQuestPickingControllerConfig, IOculusQuestPickingForcedState} from '../interfaces';


export class OculusQuestPickingController extends PickingController {
    private forcedState: IOculusQuestPickingForcedState;
    private oldModel: IOculusQuestControllersModel;

    constructor(protected viewer: any, protected config: IOculusQuestPickingControllerConfig, protected oculusQuestModel: OculusQuestModel) {
        super(config);
        this.forcedState = {
            left: {
                pose: null,
                orientation: null,
                isSqueezed: null,
            },
            right: {
                pose: null,
                orientation: null,
                isSqueezed: null,
            },
        };

        this.oculusQuestModel.on(XRControllerModelEvents.controllerChanged, (event) => {
            if (this.enabled) {
                if (this.forcedState.left.isSqueezed && !event.data.left.squeeze.pressed && this.oldModel.left.squeeze.pressed) {
                    this.forcedState.left.isSqueezed = null;
                    this.forceRelease(new Vector3, new Quaternion, false, 0);
                }
                if (this.forcedState.right.isSqueezed && !event.data.right.squeeze.pressed && this.oldModel.right.squeeze.pressed) {
                    this.forcedState.right.isSqueezed = null;
                    this.forceRelease(new Vector3, new Quaternion, false, 1);
                }
                this.oldModel = JSON.parse(JSON.stringify(event.data));
                this.update(this.viewer.camera.parent.localToWorld(
                    event.data.left.pose.position.clone()),
                    event.data.left.pose.orientation.clone(),
                    typeof this.forcedState.left.isSqueezed === 'boolean' ? this.forcedState.left.isSqueezed
                        : this.getSqueezed(event.data.left),
                    0
                );
                this.update(this.viewer.camera.parent.localToWorld(
                    event.data.right.pose.position.clone()),
                    event.data.right.pose.orientation.clone(),
                    typeof this.forcedState.right.isSqueezed === 'boolean' ? this.forcedState.right.isSqueezed
                        : this.getSqueezed(event.data.right),
                    1
                );
            }
        });
    }

    forcePickUp(object: Object3D, distance: number, newPosition: Vector3, newRotation: Quaternion, controllerNumber?: number): void {
        super.forcePickUp(object, distance, newPosition, newRotation, controllerNumber);
        if (this.enabled) {
            this.forcedState[controllerNumber ? 'right' : 'left'].isSqueezed = true;
        }
    }

    private getSqueezed(controller: any) {
        switch (this.config.buttonToPick) {
            case 'both':
                return controller.squeeze.pressed && controller.trigger.pressed;
            case 'any':
                return controller.squeeze.pressed || controller.trigger.pressed;
            default:
                return controller[this.config.buttonToPick].pressed;
        }
    }
}