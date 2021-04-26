import {BoxGeometry, DirectionalLight, Mesh, Object3D, Vector3, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import MathUtil = oimo.common.MathUtil;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import SpringDamper = oimo.dynamics.constraint.joint.SpringDamper;
import TranslationalLimitMotor = oimo.dynamics.constraint.joint.TranslationalLimitMotor;
import RotationalLimitMotor = oimo.dynamics.constraint.joint.RotationalLimitMotor;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';



export default class PhysicsSpringExample extends PhysicsExample {
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

        for (let i = 0; i < 5; i++) {
            OimoUtil.addSphere(this.world, MathUtil.randVec3In(-1, 1).scale3Eq(2, 2, 0.1).addEq(new Vec3(0, 8, 0)), 0.6, false);
        }

        this.addSpringyBoard(new Vec3(-3, 3, 0), 1, 8);
        this.addSpringyBoard(new Vec3(3, 3, 0), -1, 8);
        this.addSpringyBoard(new Vec3(-3, 4, 0), 1, 8);
        this.addSpringyBoard(new Vec3(3, 4, 0), -1, 8);

        for (let i = 0; i < 5; i++) {
            this.addSpringyFloor(new Vec3(i - 2, 0, 0));
        }
    }


    addSpringyBoard(at: Vec3, dir: number, num: number): void {
        const bodies: Array<RigidBody> = [];
        for (let i = 0; i < num; i++) {
            bodies.push(OimoUtil.addBox(this.world, at.add(new Vec3(i * 0.4 * dir, 0, 0)), new Vec3(0.2, 0.1, 0.4), i == 0));
        }

        for (let i = 1; i < num; i++) {
            const b1: RigidBody = bodies[i - 1];
            const b2: RigidBody = bodies[i];
            const anchor: Vec3 = b1.getPosition().addEq(b2.getPosition()).scaleEq(0.5);
            const axis: Vec3 = new Vec3(0, 0, 1);
            const springDamper: SpringDamper = new SpringDamper().setSpring(15, 0.4);
            const limitMotor: RotationalLimitMotor = new RotationalLimitMotor().setLimits(0, 0);
            OimoUtil.addRevoluteJoint(this.world, b1, b2, anchor, axis, springDamper, limitMotor);
        }
    }

    addSpringyFloor(at: Vec3): void {
        const base: RigidBody = OimoUtil.addBox(this.world, at.add(new Vec3(0, -2, 0)), new Vec3(0.5, 0.1, 0.5), true);
        const floor: RigidBody = OimoUtil.addBox(this.world, at, new Vec3(0.4, 0.1, 0.4), false);

        const anchor: Vec3 = floor.getPosition();
        const axis: Vec3 = new Vec3(0, 1, 0);
        const springDamper: SpringDamper = new SpringDamper().setSpring(3, 0.2);
        const limitMotor: TranslationalLimitMotor = new TranslationalLimitMotor().setLimits(0, 0);
        OimoUtil.addPrismaticJoint(this.world, base, floor, anchor, axis, springDamper, limitMotor);
    }

    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.teleportRigidBodies(-20, 10, 2, 0.1);
    }
}
