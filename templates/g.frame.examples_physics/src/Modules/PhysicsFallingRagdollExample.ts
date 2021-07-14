import {DirectionalLight, Object3D, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import Setting = oimo.common.Setting;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsFallingRagdollExample extends PhysicsExample {
    private ragdoll: RigidBody;

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
        const tmp1 = Setting.defaultRestitution;
        const tmp2 = Setting.defaultFriction;

        Setting.defaultRestitution = 0.3;
        Setting.defaultFriction = 0.2;

        const  thickness: number = 0.5;
        OimoUtil.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(7, thickness, 7), true);

        const n: number = 30; // number of steps
        const height: number = 0.5; // height of a step
        const length: number = 0.6; // length of a step
        const width: number = 4.0; // width of a step
        const stairCenter: Vec3 = new Vec3(0, 0, 0);

        for (let i = 0; i < n; i++) {
            if (i === n - 1) {
                OimoUtil.addBox(this.world, stairCenter.add(new Vec3(0, (i + 0.5) * height, -(i + 4 * 0.5) * length)), new Vec3(width * 0.5, height * 0.5, length * 4 * 0.5), true);
            } else {
                OimoUtil.addBox(this.world, stairCenter.add(new Vec3(0, (i + 0.5) * height, -(i + 0.5) * length)), new Vec3(width * 0.5, height * 0.5, length * 0.5), true);
                OimoUtil.addBox(this.world, stairCenter.add(new Vec3(-width * 0.5, (i + 2 * 0.5) * height, -(i + 0.5) * length)), new Vec3(0.1, height * 2 * 0.5, length * 0.5), true);
                OimoUtil.addBox(this.world, stairCenter.add(new Vec3(width * 0.5, (i + 2 * 0.5) * height, -(i + 0.5) * length)), new Vec3(0.1, height * 2 * 0.5, length * 0.5), true);
            }
        }

        const ragdollPos = stairCenter.add(new Vec3(0, (n - 0.5) * height + 1.46, -(n - 0.5) * length));
        console.log('OimoUtil.addRagdoll');
        this.ragdoll = OimoUtil.addRagdoll(this.world, ragdollPos);
        OimoUtil.addBox(this.world, ragdollPos.add(new Vec3(0, 0, -2)), new Vec3(0.2, 0.2, 0.2), false).setLinearVelocity(new Vec3(0, 3.5, 4));

        Setting.defaultRestitution = tmp1;
        Setting.defaultFriction = tmp2;

    }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        if (this.ragdoll != null) {
            this.camera.position.copy(OimoUtil.vector3FromVec3(this.ragdoll.getPosition().add(new Vec3(2, 5, 7))));
            this.camera.lookAt(OimoUtil.vector3FromVec3(this.ragdoll.getPosition()));
            // renderer.camera(ragdoll.getPosition().add(new Vec3(2, 5, 7)), ragdoll.getPosition(), new Vec3(0, 1, 0));
        }
    }
}
