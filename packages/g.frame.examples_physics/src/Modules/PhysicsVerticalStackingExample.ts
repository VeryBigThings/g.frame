import {DirectionalLight, Object3D, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import Setting = oimo.common.Setting;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import MathUtil = oimo.common.MathUtil;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';


export default class PhysicsVerticalStackingExample extends PhysicsExample {

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
        this.camera.position.set(0, 16, 16);
        this.camera.lookAt(0, 2, 0);

        const tmp1 = Setting.defaultRestitution;
        Setting.defaultRestitution = 0;

        const  thickness: number = 0.5;
        OimoUtil.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(7, thickness, 7), true);

        const w: number = 2;
        const sp: number = 3;
        const n: number = 6;
        const dn: number = 2;
        const size: number = 0.4;

        for (let i = -w; i < 2 + 1; i++) {
            for (let j = 0; j < n + dn * (i + w); j++) {
                OimoUtil.addBox(this.world, new Vec3(i * sp + MathUtil.randIn(-0.01, 0.01), size + j * size * 2.2, MathUtil.randIn(-0.01, 0.01)), new Vec3(size, size, size), false);
            }
        }


        Setting.defaultRestitution = tmp1;
    }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.teleportRigidBodies(-20, 10, 5, 5);
    }
}
