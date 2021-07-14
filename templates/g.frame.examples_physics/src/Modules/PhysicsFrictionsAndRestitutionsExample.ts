import {BoxGeometry, DirectionalLight, Mesh, Object3D, Vector3, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import MathUtil = oimo.common.MathUtil;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import Mat3 = oimo.common.Mat3;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsFrictionsAndRestitutionsExample extends PhysicsExample {
    constructor() {
        super();

        const directionLight = new DirectionalLight(0xffffff, 0.2);
        directionLight.position.set(6, 100, 10);
        this.addObject(directionLight);
    }

    init(actionController: ActionController, physicMeshUpdater: PhysicMeshUpdater, world: World, mousePuller: OimoMousePuller, container: Object3D, camera: PerspectiveCamera) {
        super.init(actionController, physicMeshUpdater, world, mousePuller, container, camera);

        this.initPhysic();
        this.addDemo();
    }


    initPhysic() {
        this.addObject(lines);
        this.addObject(triangles);

        if (!this.world.getDebugDraw()) {
            this.world.setDebugDraw(new DebugDraw());
        }
        this.world.getDebugDraw().drawJointLimits = true;
    }

    addDemo() {
        this.camera.position.set(0, 7, 9);
        this.camera.lookAt(0, 2, 0);

        const thickness: number = 0.5;
        OimoUtil.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(7, thickness, 7), true);

        const rotMat: Mat3 = new Mat3().appendRotationEq(20 * MathUtil.TO_RADIANS, 0, 0, 1);
        const tiltedFloor: RigidBody = OimoUtil.addBox(this.world, new Vec3(0, 2, 0), new Vec3(3, 0.1, 1), true);
        tiltedFloor.rotate(rotMat);
        tiltedFloor.getShapeList().setFriction(0.5);

        for (let i = 0; i < 7; i++) {
            const pos: Vec3 = new Vec3((i - 3) * 0.8, 0, 0);
            pos.mulMat3Eq(rotMat);
            pos.y += 2.3;
            const box: RigidBody = OimoUtil.addBox(this.world, pos, new Vec3(0.2, 0.2, 0.2), false);
            box.getShapeList().setFriction(i / 16);
            box.rotate(rotMat);
        }

        const bouncyFloor: RigidBody = OimoUtil.addBox(this.world, new Vec3(0, 0.1, 2), new Vec3(3, 0.1, 1), true);
        bouncyFloor.getShapeList().setRestitution(1.0);

        for (let i = 0; i < 7; i++) {
            const pos: Vec3 = new Vec3((i - 3) * 0.8, 3, 2);
            OimoUtil.addSphere(this.world, pos, 0.25, false).getShapeList().setRestitution(i / 6);
        }
    }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.teleportRigidBodies(-20, 10, 5, 5);
    }
}
