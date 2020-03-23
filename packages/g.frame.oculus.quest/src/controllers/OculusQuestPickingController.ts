import {IPickingControllerConfig, PickingController} from '@verybigthings/g.frame.core';


export class OculusQuestPickingController extends PickingController {

    constructor(protected config: IPickingControllerConfig, QuestController: any) {
        super(config);

        QuestController.on('controllerChange', (event) => {
            // this.update(Viewer.camera.parent.localToWorld(event.data.left.pose.position.clone()), event.data.left.pose.orientation, event.data.left.squeeze.pressed, 0);
            // this.update(Viewer.camera.parent.localToWorld(event.data.right.pose.position.clone()), event.data.right.pose.orientation, event.data.right.squeeze.pressed, 1);
        });

    }
}