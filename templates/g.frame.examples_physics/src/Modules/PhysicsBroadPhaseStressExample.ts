import {DirectionalLight, Object3D, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import Setting = oimo.common.Setting;
import OBoxGeometry = oimo.collision.geometry.BoxGeometry;
import OSphereGeometry = oimo.collision.geometry.SphereGeometry;
import Shape = oimo.dynamics.rigidbody.Shape;
import Transform = oimo.common.Transform;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import MathUtil = oimo.common.MathUtil;
import ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
import RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
// import Control = oimo.common.Control;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsBroadPhaseStressExample extends PhysicsExample {
    private RIGID_BODIES_STEP: number = 100;
    private FIELD_W: number = 50;
    private FIELD_H: number = 50;
    private FIELD_D: number = 50;

    private pairTestCount: number;
    private treeBalance: number;
    private speed: number = 4;

    constructor() {
        super();

        const directionLight = new DirectionalLight(0xffffff, 0.2);
        directionLight.position.set(6, 100, 10);
        this.addObject(directionLight);
    }

    init(actionController: ActionController, physicMeshUpdater: PhysicMeshUpdater, world: World, mousePuller: OimoMousePuller, container: Object3D, camera: PerspectiveCamera) {
        super.init(actionController, physicMeshUpdater, world, mousePuller, container, camera);

        console.log('>>>', oimo);

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
    }


    //
    // public initControls(controls:Array<Control>):Void {
    //     controls.push(new Control("↑", function():String {
    //         return "increase shapes";
    //     }, UserInput.KEYCODE_UP, function():Void {
    //         increaseRigidBodies();
    //     }));
    //     controls.push(new Control("↓", function():String {
    //         return "decrease shapes";
    //     }, UserInput.KEYCODE_DOWN, function():Void {
    //         decreaseRigidBodies();
    //     }));
    //     controls.push(new Control("→", function():String {
    //         return "increase speed";
    //     }, UserInput.KEYCODE_RIGHT, function():Void {
    //         speed += 2;
    //         if (speed > 20) speed = 20;
    //     }));
    //     controls.push(new Control("←", function():String {
    //         return "decrease speed";
    //     }, UserInput.KEYCODE_LEFT, function():Void {
    //         speed -= 2;
    //         if (speed < 0) speed = 0;
    //     }));
    // }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();


        // const bp: BroadPhase = this.world.getBroadPhase();
        // pairTestCount = bp.getTestCount();
        // if (Std.is(bp, BvhBroadPhase)) {
        //     this.treeBalance = cast(bp, BvhBroadPhase).getTreeBalance();
        // } else {
        //     this.treeBalance = 0;
        // }
        // this.reflectRigidBodies();
    }

    additionalInfo(): string {
        return (
            '  broad-phase test count: $pairTestCount\n' +
            '  tree balance          : $treeBalance\n'
        );
    }

    increaseRigidBodies(): void {
        const scale: number = 0.7;
        const num: number = this.RIGID_BODIES_STEP;
        const shapes = [
            new OBoxGeometry(new Vec3(0.4, 0.5, 0.6).scaleEq(scale)),
            new OSphereGeometry(0.5 * scale)
        ];
        const compc = new ShapeConfig();
        const rigidc = new RigidBodyConfig();
        for (let i = 0; i < num; i++) {
            compc.geometry = shapes[parseInt('' + Math.random() * 2)];
            compc.position.init(MathUtil.randIn(-1, 1), MathUtil.randIn(-1, 1), MathUtil.randIn(-1, 1));
            compc.position.scaleEq(0);
            rigidc.position.init(MathUtil.randIn(-1, 1), MathUtil.randIn(-1, 1), MathUtil.randIn(-1, 1));
            rigidc.position.x *= this.FIELD_W;
            rigidc.position.y *= this.FIELD_H;
            rigidc.position.z *= this.FIELD_D;
            const body = new RigidBody(rigidc);
            body.addShape(new Shape(compc));
            this.moveRigidBody(body);
            this.world.addRigidBody(body);
        }
    }

    moveRigidBody(b: RigidBody): void {
        const speed: number = this.speed;
        const v = new Vec3().init(MathUtil.randIn(-1, 1), MathUtil.randIn(-1, 1), MathUtil.randIn(-1, 1)).normalize().scaleEq(speed);
        const av = new Vec3().init(MathUtil.randIn(-1, 1), MathUtil.randIn(-1, 1), MathUtil.randIn(-1, 1)).scaleEq(5);
        b.setLinearVelocity(v);
        b.setAngularVelocity(av);
    }

    decreaseRigidBodies(): void {
        const num: number = this.RIGID_BODIES_STEP;
        if (num > this.world.getNumRigidBodies()) {
            return;
        }
        let rb = this.world.getRigidBodyList();
        while (rb.getNext() != null) {
            rb = rb.getNext();
        }
        for (let i = 0; i < num; i++) {
            const prev = rb.getPrev();
            this.world.removeRigidBody(rb);
            rb = prev;
        }
    }

    reflectRigidBodies(): void {
        let rb: RigidBody = this.world.getRigidBodyList();
        const pos: Vec3 = new Vec3();
        while (rb != null) {
            rb.getPositionTo(pos);
            const lv = rb.getLinearVelocity();
            if (pos.x < -this.FIELD_W || pos.x > this.FIELD_W) lv.x *= -1;
            if (pos.y < -this.FIELD_H || pos.y > this.FIELD_H) lv.y *= -1;
            if (pos.z < -this.FIELD_D || pos.z > this.FIELD_D) lv.z *= -1;
            rb.setLinearVelocity(lv);
            rb = rb.getNext();
        }
    }
}
