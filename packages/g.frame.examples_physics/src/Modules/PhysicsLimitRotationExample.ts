import {DirectionalLight, Object3D, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import Setting = oimo.common.Setting;
import Shape = oimo.dynamics.rigidbody.Shape;
import Transform = oimo.common.Transform;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import MathUtil = oimo.common.MathUtil;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsLimitRotationExample extends PhysicsExample {
    private body: RigidBody;

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

        const w: number = 2;
        const h: number = 2;
        const sp: number = 0.61;
        const n: number = 5;
        const size: number = 0.3;

        for (let i = 0; i < n; i++) {
            for (let j = -w; j < w + 1; j++) {
                for (let k = -h; k < h + 1; k++) {
                    const pos: Vec3 = new Vec3(j * sp, size + i * size * 3, k * sp);
                    const box: RigidBody = OimoUtil.addBox(this.world, pos, new Vec3(size, size, size), false);
                    box.setRotationFactor(new Vec3(0, 0, 0));
                }
            }
        }

        const cylinder: RigidBody = OimoUtil.addCylinder(this.world, new Vec3(0, 8, 0), 1.0, 0.3, false);
        const cylinderShape: Shape = cylinder.getShapeList();

        // modify local transform
        const localTransform: Transform = cylinderShape.getLocalTransform();
        localTransform.rotateXyz(new Vec3(MathUtil.HALF_PI, 0, 0));
        cylinderShape.setLocalTransform(localTransform);

        // limit rotation
        cylinder.setRotationFactor(new Vec3(0, 0, 1));

        this.body = cylinder;
    }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.teleportRigidBodies(-20, 10, 5, 5);
    }
}
