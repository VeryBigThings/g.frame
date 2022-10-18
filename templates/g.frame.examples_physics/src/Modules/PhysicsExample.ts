import {Object3D, Vector3, PerspectiveCamera} from 'three';
import {GframeModule} from '@g.frame/core';
import {ActionController} from '@g.frame/common.action_controller';
import {OimoMousePuller, PhysicMeshUpdater, WorldFactory} from '@g.frame/physics.oimo';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import Vec3 = oimo.common.Vec3;
import MathUtil = oimo.common.MathUtil;


export class PhysicsExample extends GframeModule {
    public world: World;
    public dt: number;
    public camera: PerspectiveCamera;

    public cameraPosition: Vector3;
    public cameraTargetNormal: Vector3;
    public actionController: ActionController;
    public physicMeshUpdater: PhysicMeshUpdater;
    public worldFactory: WorldFactory;
    public mousePuller: OimoMousePuller;

    constructor() {
        super();
    }

    init(actionController: ActionController, physicMeshUpdater: PhysicMeshUpdater, world: World, mousePuller: OimoMousePuller, container: Object3D, camera?: PerspectiveCamera) {
        this.actionController = actionController;
        this.physicMeshUpdater = physicMeshUpdater;
        this.world = world;
        this.mousePuller = mousePuller;
        this.camera = camera;
        container.add(this.uiObject);
    }

    teleportRigidBodies(thresholdY: number, toY: number, rangeX: number, rangeZ: number): void {
        let rb: RigidBody = this.world.getRigidBodyList();
        const pos: Vec3 = new Vec3();
        const zero: Vec3 = new Vec3();
        while (rb != null) {
            rb.getPositionTo(pos);
            if (pos.y < thresholdY) {
                pos.y = toY;
                pos.x = MathUtil.randIn(-1, 1) * rangeX;
                pos.z = MathUtil.randIn(-1, 1) * rangeZ;
                rb.setPosition(pos);
                rb.setLinearVelocity(zero);
            }
            rb = rb.getNext();
        }
    }
}
