import {DirectionalLight, Object3D, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import OGeometry = oimo.collision.geometry.Geometry;
import OBoxGeometry = oimo.collision.geometry.BoxGeometry;
import OConeGeometry = oimo.collision.geometry.ConeGeometry;
import OCylinderGeometry = oimo.collision.geometry.CylinderGeometry;
import ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import MathUtil = oimo.common.MathUtil;
import Shape = oimo.dynamics.rigidbody.Shape;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsCompoundShapesExample extends PhysicsExample {
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
        this.world.getDebugDraw().drawJointLimits = false;
    }

    addDemo() {
        this.camera.position.set(0, 7, 9);
        this.camera.lookAt(0, 2, 0);

        const thickness: number = 0.5;
        OimoUtil.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(7, thickness, 7), true);

        const n: number = 32;
        const rc: RigidBodyConfig = new RigidBodyConfig();

        {
            const geom1: OGeometry = new OBoxGeometry(new Vec3(0.3, 0.1, 0.3));
            const geom2: OGeometry = new OBoxGeometry(new Vec3(0.1, 0.3, 0.1));

            const sc1: ShapeConfig = new ShapeConfig();
            const sc2: ShapeConfig = new ShapeConfig();
            sc1.geometry = geom1;
            sc2.geometry = geom2;
            sc1.position.init(0, 0.2, 0);
            sc2.position.init(0, -0.2, 0);


            for (let i = 0; i < n; i++) {
                rc.position.init(-2, 1 + i, 0).addEq(MathUtil.randVec3In(-0.01, 0.01));
                const rb: RigidBody = new RigidBody(rc);
                rb.addShape(new Shape(sc1));
                rb.addShape(new Shape(sc2));
                this.world.addRigidBody(rb);
            }
        }

        {
            const geom1: OGeometry = new OConeGeometry(0.275, 0.325);
            const geom2: OGeometry = new OBoxGeometry(new Vec3(0.3, 0.075, 0.3));

            const sc1: ShapeConfig = new ShapeConfig();
            const sc2: ShapeConfig = new ShapeConfig();
            sc1.geometry = geom1;
            sc2.geometry = geom2;
            sc1.position.init(0, 0.2, 0);
            sc2.position.init(0, -0.2, 0);

            for (let i = 0; i < n; i++) {
                rc.position.init(0, 1 + i, 0).addEq(MathUtil.randVec3In(-0.01, 0.01));
                const rb: RigidBody = new RigidBody(rc);
                rb.addShape(new Shape(sc1));
                rb.addShape(new Shape(sc2));
                this.world.addRigidBody(rb);
            }
        }

        {
            const geom1: OGeometry = new OCylinderGeometry(0.25, 0.4);
            const geom2: OGeometry = new OBoxGeometry(new Vec3(0.075, 0.4, 0.075));

            const sc1: ShapeConfig = new ShapeConfig();
            const sc2: ShapeConfig = new ShapeConfig();
            sc1.geometry = geom1;
            sc2.geometry = geom2;
            sc1.position.init(0, 0, 0);
            sc2.position.init(0, -0.1, 0);
            sc1.rotation.appendRotationEq(90 * MathUtil.TO_RADIANS, 0, 0, 1);

            for (let i = 0; i < n; i++) {
                rc.position.init(2, 1 + i, 0).addEq(MathUtil.randVec3In(-0.01, 0.01));
                const rb: RigidBody = new RigidBody(rc);
                rb.addShape(new Shape(sc1));
                rb.addShape(new Shape(sc2));
                this.world.addRigidBody(rb);
            }
        }
    }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.teleportRigidBodies(-20, 10, 5, 5);
    }
}
