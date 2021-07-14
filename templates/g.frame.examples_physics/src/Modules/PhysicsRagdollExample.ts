import {DirectionalLight, Object3D, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import Setting = oimo.common.Setting;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsRagdollExample extends PhysicsExample {
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
        this.camera.position.set(0, 5, 6);
        this.camera.lookAt(0, 2, 0);

        OimoUtil.addBox(this.world, new Vec3(0, -0.2, 0), new Vec3(6, 0.2, 6), true);

        const tmp = Setting.defaultFriction;
        Setting.defaultFriction = 0.5;

        for (let i = 0; i < 10; i++) {
            OimoUtil.addRagdoll(this.world, new Vec3(0, 2 + i * 2, 0));
        }

        Setting.defaultFriction = tmp;
    }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();
    }
}
