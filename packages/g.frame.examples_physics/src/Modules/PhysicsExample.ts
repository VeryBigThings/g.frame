import {Object3D, Vector3} from 'three';
import {ViewerModule} from '@g.frame/core';
import {ActionController} from '@g.frame/common.action_controller';
import {OimoMousePuller, PhysicMeshUpdater, WorldFactory} from '@g.frame/physics.oimo';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;


export class PhysicsExample extends ViewerModule {
    public world: World;

    public cameraPosition: Vector3;
    public cameraTargetNormal: Vector3;
    public actionController: ActionController;
    public physicMeshUpdater: PhysicMeshUpdater;
    public worldFactory: WorldFactory;
    public mousePuller: OimoMousePuller;

    constructor() {
        super();
    }

    init(actionController: ActionController, physicMeshUpdater: PhysicMeshUpdater, world: World, mousePuller: OimoMousePuller, container: Object3D) {
        this.actionController = actionController;
        this.physicMeshUpdater = physicMeshUpdater;
        this.world = world;
        this.mousePuller = mousePuller;
        container.add(this.uiObject);
    }

    public someFunction1() {
    }

    public someFunction2() {
    }

    public someFunction3() {
    }

}
