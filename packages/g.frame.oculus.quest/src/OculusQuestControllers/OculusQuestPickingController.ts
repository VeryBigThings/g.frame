import {IPickingControllerConfig, PickingController} from '@verybigthings/g.frame.common.picking_controller';
import {OculusQuestModel} from '../OculusQuestModel';
import {XRControllerModelEvents} from '@verybigthings/g.frame.common.xr_manager';

export class OculusQuestPickingController extends PickingController {
    constructor(protected data: any, protected config: IPickingControllerConfig, protected oculusQuestModel: OculusQuestModel) {
        super(config);

        this.oculusQuestModel.on(XRControllerModelEvents.controllerChanged, (event) => {
            this.update(this.data.viewer.camera.parent.localToWorld(
                event.data.left.pose.position.clone()),
                event.data.left.pose.orientation,
                event.data.left.squeeze.pressed, 0
            );

            console.log('left controller pos', this.data.viewer.camera.parent.localToWorld(
                event.data.left.pose.position.clone()));
            this.update(this.data.viewer.camera.parent.localToWorld(
                event.data.right.pose.position.clone()),
                event.data.right.pose.orientation,
                event.data.right.squeeze.pressed, 1
            );
        });
    }
}