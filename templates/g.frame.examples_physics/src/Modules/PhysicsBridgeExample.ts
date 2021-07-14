import {BoxGeometry, DirectionalLight, Mesh, Object3D, Vector3, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import MathUtil = oimo.common.MathUtil;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import OBoxGeometry = oimo.collision.geometry.BoxGeometry;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsBridgeExample extends PhysicsExample {
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
        this.camera.position.set(0, 8, 12);
        this.camera.lookAt(0, 2, 0);

        for (let i = 0; i < 5; i++) {
            OimoUtil.addSphere(this.world, new Vec3(MathUtil.randIn(-4, 4), MathUtil.randIn(2, 3), MathUtil.randIn(-1, 1)), 0.8, false).getShapeList().setDensity(0.3);
            OimoUtil.addBox(this.world, new Vec3(MathUtil.randIn(-4, 4), MathUtil.randIn(2, 3), MathUtil.randIn(-1, 1)), new Vec3(0.5, 0.5, 0.5), false).getShapeList().setDensity(0.3);
            OimoUtil.addCone(this.world, new Vec3(MathUtil.randIn(-4, 4), MathUtil.randIn(2, 3), MathUtil.randIn(-1, 1)), 0.6, 0.6, false).getShapeList().setDensity(0.3);
        }

        const num = 20;
        const width = 3.0;
        const length = 0.7;
        const gap = 0.05;
        const height = 0.3;
        const dir = new Vec3(width, 0, 0);


        const bodies: Array<RigidBody> = [];
        for (let i = 0; i < num; i++) {
            const x = (i - (num - 1) * 0.5) * (length + gap);
            bodies.push(OimoUtil.addBox(this.world, new Vec3(x, 0, 0), new Vec3(length * 0.5, height * 0.5, width * 0.5), i === 0 || i === num - 1));
        }

        for (let i = 0; i < num - 1; i++) {
            OimoUtil.addRevoluteJoint(this.world, bodies[i], bodies[i + 1], bodies[i].getPosition().add(bodies[i + 1].getPosition()).scale(0.5), new Vec3(0, 0, 1));
        }

        for (let i = 0; i < num; i++) {
            const newPos = bodies[i].getPosition();
            newPos.x *= 0.95;
            bodies[i].setPosition(newPos);
        }
    }


    public addBox(w: World, center: Vec3, halfExtents: Vec3, wall: boolean): { physics: RigidBody, meshBox: Mesh } {
        const meshBox = new Mesh(new BoxGeometry(halfExtents.x, halfExtents.y, halfExtents.z));
        // meshBox.visible = false;
        meshBox.position.set(center.x, center.y, center.z);

        this.addObject(meshBox);

        const physics = OimoUtil.addRigidBody(w, center, new OBoxGeometry(new Vec3(halfExtents.x / 2, halfExtents.y / 2, halfExtents.z / 2)), wall);
        meshBox.userData.physics = physics;
        this.physicMeshUpdater.register(meshBox);
        return {
            physics: physics,
            meshBox: meshBox
        };
    }


    public randVec3In(min: number, max: number): Vec3 {

        return new Vec3(min + Math.random() * (max - min), min + Math.random() * (max - min), min + Math.random() * (max - min));
    }

    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.teleportRigidBodies(-20, 10, 5, 0);
    }
}
