import {Vector3} from "three";
import {ViewerModule} from "@verybigthings/g.frame.core";
import {ActionController} from "@verybigthings/g.frame.common.action_controller";

export class PhysicsExample extends ViewerModule {
    public cameraPosition: Vector3;
    public cameraTargetNormal: Vector3;
    private actionController: ActionController;

    constructor() {
        super();
    }

    init(actionController: ActionController) {
        this.actionController = actionController;
    }

    public someFunction1() {
    }

    public someFunction2() {
    }

    public someFunction3() {
    }

}