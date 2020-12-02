import {Object3D, Vector3} from "three";
import {ViewerModule} from "@verybigthings/g.frame.core";
import {ActionController} from "@verybigthings/g.frame.common.action_controller";
import {PhysicMeshUpdater, WorldFactory} from "@verybigthings/g.frame.physics.oimo";

export class PhysicsExample extends ViewerModule {
    public cameraPosition: Vector3;
    public cameraTargetNormal: Vector3;
    public actionController: ActionController;
    public physicMeshUpdater: PhysicMeshUpdater;
    public worldFactory: WorldFactory;

    constructor() {
        super();
    }

    init(actionController: ActionController, physicMeshUpdater: PhysicMeshUpdater, worldFactory: WorldFactory, container: Object3D) {
        this.actionController = actionController;
        this.physicMeshUpdater = physicMeshUpdater;
        this.worldFactory = worldFactory;
        container.add(this.uiObject);
    }

    public someFunction1() {
    }

    public someFunction2() {
    }

    public someFunction3() {
    }

}