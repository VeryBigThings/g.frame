import {DirectionalLight, Object3D, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import MathUtil = oimo.common.MathUtil;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import Shape = oimo.dynamics.rigidbody.Shape;
import ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
import Mat3 = oimo.common.Mat3;
import OBoxGeometry = oimo.collision.geometry.BoxGeometry;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';



export default class PhysicsVariableTimeStepExample extends PhysicsExample {
    private bullet: RigidBody;

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
        this.camera.position.set(-5, 7, 9);
        this.camera.lookAt(0, 2, 0);

        const thickness: number = 0.5;
        OimoUtil.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(5, thickness, 5), true);

        const w: number = 5;
        const h: number = 1;
        const n: number = 5;
        const wid: number = 0.3;
        const hei: number = 0.3;
        const dep: number = 0.3;
        for (let i = 0; i < n; i++) {
            for (let k = -h; k < h + 1; k++) {
                for (let j = 0; j < w; j++) {
                    if ((j + k & 1) === 0) OimoUtil.addBox(this.world, new Vec3(j * wid * 2 + MathUtil.randIn(-0.01, 0.01), hei + i * hei * 2.2, k * dep * 2 + MathUtil.randIn(-0.01, 0.01)), new Vec3(wid, hei, dep), false);
                    else OimoUtil.addCylinder(this.world, new Vec3(j * wid * 2 + MathUtil.randIn(-0.01, 0.01), hei + i * hei * 2.2, k * dep * 2 + MathUtil.randIn(-0.01, 0.01)), wid, hei, false);
                }
            }
        }

        {
            const b = OimoUtil.addBox(this.world, new Vec3(-4, 4, -4), new Vec3(0.5, 0.5, 0.5), false);
            b.setLinearVelocity(new Vec3(5, 0, 4));
            b.setAngularVelocity(new Vec3(3, 6, 8));
        }

        const bulletSize: number = hei;

        const sc = new ShapeConfig();
        sc.geometry = new OBoxGeometry(new Vec3(0.4, 1, 0.4).scale(bulletSize));
        sc.position.y -= bulletSize * 1.5 + bulletSize;

        this.bullet = OimoUtil.addCone(this.world, new Vec3(-150, 3, 0), bulletSize * 1.4, bulletSize * 1.5, false);
        this.bullet.addShape(new Shape(sc));
        this.bullet.rotate(new Mat3().appendRotation(MathUtil.HALF_PI, 0, 0, -1));
        this.bullet.getShapeList().setDensity(50);
        this.bullet.setLinearVelocity(new Vec3(300, 0, 0));
        this.bullet.setAngularVelocity(new Vec3(MathUtil.TWO_PI * 100, 0, 0));
    }

    update(): void {
        super.update();

        let timeStep: number = MathUtil.abs(0 - this.bullet.getPosition().x) / 8000;
        if (this.bullet.getPosition().x > 0) timeStep *= 10;

        let maxTimeStep: number = 1 / 60;
        if (this.bullet.getPosition().x < -10) maxTimeStep = 1 / 180;

        if (timeStep < 1 / 10000) timeStep = 1 / 10000;
        if (timeStep > maxTimeStep) timeStep = maxTimeStep;

        this.world.step(timeStep);
        this.world.debugDraw();
    }
}
