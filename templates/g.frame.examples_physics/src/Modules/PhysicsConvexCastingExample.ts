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
// import Control = oimo.common.Control;
import RayCastClosest = oimo.dynamics.callback.RayCastClosest;
import OCylinderGeometry = oimo.collision.geometry.CylinderGeometry;
import RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
import RigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
import RagdollJointConfig = oimo.dynamics.constraint.joint.RagdollJointConfig;
import RagdollJoint = oimo.dynamics.constraint.joint.RagdollJoint;
import ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
import OSphereGeometry = oimo.collision.geometry.SphereGeometry;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsConvexCastingExample extends PhysicsExample {
    private lps: Array<LaserPointer>;

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

        // this.world.getDebugDraw().drawJointLimits = false;
    }

    addDemo() {
        this.camera.position.set(0, 7, 7);
        this.camera.lookAt(0, 0, 0);

        const thickness: number = 0.5;
        OimoUtil.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(5, thickness, 5), true);

        const w: number = 2;
        const h: number = 2;
        const sp: number = 0.8;
        const n: number = 3;
        let wid: number = 0.3;
        let hei: number = 0.3;
        const spH: number = hei * 2;

        for (let i = 0; i < n; i++) {
            for (let j = -w; j < w + 1; j++) {
                for (let k = -h; k < h + 1; k++) {
                    Setting.defaultDensity = (i === n - 1) ? 1 : 1;

                    wid = MathUtil.randIn(0.2, 0.4);
                    hei = MathUtil.randIn(0.2, 0.4);

                    switch (parseInt('' + 5 * Math.random())) {
                        case 0:
                            OimoUtil.addCylinder(this.world, new Vec3(j * sp + MathUtil.randIn(-0.01, 0.01), spH + i * spH * 2 * 1.002, k * sp + MathUtil.randIn(-0.01, 0.01)), wid, hei, false);
                            break;
                        case 1:
                            OimoUtil.addCone(this.world, new Vec3(j * sp + MathUtil.randIn(-0.01, 0.01), spH + i * spH * 2 * 1.002, k * sp + MathUtil.randIn(-0.01, 0.01)), wid, hei, false);
                            break;
                        case 2:
                            OimoUtil.addCapsule(this.world, new Vec3(j * sp + MathUtil.randIn(-0.01, 0.01), spH + i * spH * 2 * 1.002, k * sp + MathUtil.randIn(-0.01, 0.01)), wid, hei, false);
                            break;
                        case 3:
                            OimoUtil.addBox(this.world, new Vec3(j * sp + MathUtil.randIn(-0.01, 0.01), spH + i * spH * 2 * 0.9998, k * sp + MathUtil.randIn(-0.01, 0.01)), new Vec3(wid, hei, wid), false);
                            break;
                        case 4:
                            OimoUtil.addSphere(this.world, new Vec3(j * sp + MathUtil.randIn(-0.01, 0.01), spH + i * spH * 2 * 0.9998, k * sp + MathUtil.randIn(-0.01, 0.01)), wid, false);
                            break;
                    }
                }
            }
        }

        this.lps = [];
        this.lps.push(new LaserPointer(new Vec3(-2, 4, 0), this.world, new Vec3(0, 1, 0)));
        this.lps.push(new LaserPointer(new Vec3(-1, 4, 0), this.world, new Vec3(0, 1, 0)));
        this.lps.push(new LaserPointer(new Vec3(0, 4, 0), this.world, new Vec3(0, 1, 0)));
        this.lps.push(new LaserPointer(new Vec3(1, 4, 0), this.world, new Vec3(0, 1, 0)));
        this.lps.push(new LaserPointer(new Vec3(2, 4, 0), this.world, new Vec3(0, 1, 0)));
    }

    drawAdditionalObjects(debugDraw: DebugDraw): void {
        const w = debugDraw.wireframe;
        debugDraw.wireframe = true;

        for (let lp of this.lps) lp.draw(debugDraw);

        debugDraw.wireframe = w;
    }

    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.drawAdditionalObjects(this.world.getDebugDraw());
        this.teleportRigidBodies(-20, 10, 5, 5);
    }
}

class LaserPointer {
    public rb: RigidBody;
    public cb: RayCastClosest;
    public world: World;
    public color: Vec3;
    public length: number;

    constructor(pos: Vec3, world: World, color: Vec3) {
        this.world = world;
        this.color = color;
        this.cb = new RayCastClosest();

        length = 0.4;

        const rc = new RigidBodyConfig();
        rc.autoSleep = false;
        rc.angularDamping = 4.0;

        rc.position.copyFrom(pos);
        this.rb = new RigidBody(rc);
        const sc = new ShapeConfig();
        sc.geometry = new OCylinderGeometry(0.2, length);
        this.rb.addShape(new Shape(sc));
        this.world.addRigidBody(this.rb);

        rc.position.addEq(new Vec3(0, length, 0));
        rc.type = RigidBodyType.STATIC;
        const fix: RigidBody = new RigidBody(rc);
        sc.geometry = new OSphereGeometry(0.1);
        fix.addShape(new Shape(sc));
        this.world.addRigidBody(fix);

        const jc: RagdollJointConfig = new RagdollJointConfig();
        jc.init(this.rb, fix, this.rb.getPosition().addEq(new Vec3(0, length, 0)), new Vec3(0, 1, 0), new Vec3(1, 0, 0));
        jc.twistLimitMotor.setLimits(0, 0);
        jc.maxSwingAngle1 = MathUtil.TO_RADIANS * 90;
        jc.maxSwingAngle2 = MathUtil.TO_RADIANS * 90;

        world.addJoint(new RagdollJoint(jc));
    }

    draw(debugDraw: DebugDraw): void {
        const tf: Transform = this.rb.getTransform();
        const begin: Vec3 = new Vec3(0, -length, 0).mulTransform(tf);
        const end: Vec3 = new Vec3(0, -length - 20, 0).mulTransform(tf);
        const depth: number = 3;
        const r: Vec3 = end.sub(begin);
        const convex: OCylinderGeometry = <OCylinderGeometry>this.rb.getShapeList().getGeometry();
        this.cb.clear();

        const green: Vec3 = new Vec3(0, 1, 0);
        this.world.convexCast(convex, tf, r, this.cb);
        if (this.cb.hit) {
            debugDraw.line(begin, begin.addScaled(r, this.cb.fraction), green);
            tf.setPosition(tf.getPosition().addScaledEq(r, this.cb.fraction));
            debugDraw.cylinder(tf, convex.getRadius(), convex.getHalfHeight(), green);
            debugDraw.point(this.cb.position, green);
        }
    }
}
