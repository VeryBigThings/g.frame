import {BoxGeometry, DirectionalLight, Mesh, Object3D, Vector3, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import MathUtil = oimo.common.MathUtil;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
import OGeometry = oimo.collision.geometry.Geometry;
import RotationalLimitMotor = oimo.dynamics.constraint.joint.RotationalLimitMotor;
import OConvexHullGeometry = oimo.collision.geometry.ConvexHullGeometry;
import Mat3 = oimo.common.Mat3;
import Shape = oimo.dynamics.rigidbody.Shape;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';



export default class PhysicsGearsExample extends PhysicsExample {
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
        this.camera.position.set(0, 6, 8);
        this.camera.lookAt(0, 2, 0);

        const thickness: number = 0.2;
        OimoUtil.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(4, thickness, 1), true);

        this.createGear(new Vec3(1, 3, 0.5), 1.0, 0.3);
        this.createGear(new Vec3(3, 3, 0.5), 1.0, 0.3);
        this.createGear(new Vec3(-0.5, 3, 0), 0.5, 1.6);
        this.createGear(new Vec3(1.5, 3, -0.5), 1.5, 0.3);
        this.createGear(new Vec3(-2, 3, 0), 1.0, 0.3, new RotationalLimitMotor().setMotor(MathUtil.PI, 50));
        this.createGear(new Vec3(-3.5, 3, 0), 0.5, 0.3);

        for (let i = 0; i < 20; i++) {
            OimoUtil.addBox(this.world, MathUtil.randVec3In(-1, 1).scale3Eq(3, 1, 1).addEq(new Vec3(0, 6, 0)), new Vec3(0.2, 0.2, 0.2), false);
            OimoUtil.addSphere(this.world, MathUtil.randVec3In(-1, 1).scale3Eq(3, 1, 1).addEq(new Vec3(0, 6, 0)), 0.3, false);
        }
    }

    // note the gear is locally y-up
    createGear(center: Vec3, radius: number, thickness: number, lm: RotationalLimitMotor = null): void {
        const toothInterval: number = 0.4;
        const toothLength: number = toothInterval / 1.5;
        let numTeeth: number = Math.round(MathUtil.TWO_PI * radius / toothInterval) + 1;
        if (numTeeth % 2 === 0) numTeeth--;
        if (numTeeth < 2) numTeeth = 2;

        const toothPos: Vec3 = new Vec3(radius - toothLength / 4, 0, 0);
        const toothRot: Mat3 = new Mat3();
        const dtoothRot: Mat3 = new Mat3().appendRotationEq(MathUtil.TWO_PI / numTeeth, 0, 1, 0);

        const toothGeom: OGeometry = this.createGearTooth(toothLength / 2, thickness * 0.5, toothInterval / 3);
        const toothSc: ShapeConfig = new ShapeConfig();
        toothSc.restitution = 0;
        toothSc.geometry = toothGeom;

        const wheel: RigidBody = OimoUtil.addCylinder(this.world, center, radius - toothLength / 2, thickness * 0.48, false);
        for (let i = 0; i < numTeeth; i++) {
            toothSc.position = toothPos;
            toothSc.rotation = toothRot;
            wheel.addShape(new Shape(toothSc));

            toothPos.mulMat3Eq(dtoothRot);
            toothRot.mulEq(dtoothRot);
        }

        wheel.rotate(new Mat3().appendRotationEq(90 * MathUtil.TO_RADIANS, 1, 0, 0));

        const fixture: RigidBody = OimoUtil.addCylinder(this.world, center, toothInterval / 4, thickness * 0.52, true);
        fixture.rotate(new Mat3().appendRotationEq(90 * MathUtil.TO_RADIANS, 1, 0, 0));

        OimoUtil.addRevoluteJoint(this.world, wheel, fixture, center, new Vec3(0, 0, 1), null, lm);
    }

    createGearTooth(hw: number, hh: number, hd: number): OGeometry {
        const scale: number = 0.3;
        const vertices: Array<Vec3> = [
            new Vec3(-hw, -hh, -hd),
            new Vec3(-hw, -hh, hd),
            new Vec3(-hw, hh, -hd),
            new Vec3(-hw, hh, hd),
            new Vec3(hw, -hh, -hd * scale),
            new Vec3(hw, -hh, hd * scale),
            new Vec3(hw, hh, -hd * scale),
            new Vec3(hw, hh, hd * scale),
        ];
        const geom: OConvexHullGeometry = new OConvexHullGeometry(vertices);
        geom.setGjkMergin(0); // set external margin to 0 (not needed for other geoms)
        return geom;
    }

    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.teleportRigidBodies(-20, 10, 3, 1);
    }
}
