




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
import OConvexHullGeometry = oimo.collision.geometry.ConvexHullGeometry;
import ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import MathUtil = oimo.common.MathUtil;
import Shape = oimo.dynamics.rigidbody.Shape;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

function rand(): number {
    let x: number = Math.pow(Math.random(), 0.7);
    if (Math.random() < 0.5) x = -x;
    return x;
}

export default class PhysicsConvexHullExample extends PhysicsExample {
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

        const w: number = 1;
        const h: number = 1;
        const sp: number = 0.61;
        const n: number = 3;
        const wid: number = 0.6;
        const hei: number = 0.6;
        const dep: number = 0.6;

        for (let i = 0; i < n; i++) {
            for (let j = -w; j < w + 1; j++) {
                for (let k = -h; k < h + 1; k++) {
                    const center: Vec3 = new Vec3(j * wid * 2, hei + i * hei * 3.0, k * dep * 2);
                    const bc: RigidBodyConfig = new RigidBodyConfig();
                    const sc: ShapeConfig = new ShapeConfig();
                    bc.position = center;
                    const convesPoints: Array<Vec3> = [];
                    for (let p = 0; p < 8; p++) convesPoints.push(new Vec3(rand() * wid, rand() * hei, rand() * dep));
                    sc.geometry = new OConvexHullGeometry(convesPoints);

                    const b: RigidBody = new RigidBody(bc);
                    b.addShape(new Shape(sc));
                    this.world.addRigidBody(b);
                }
            }
        }
    }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();

        this.teleportRigidBodies(-20, 10, 5, 5);
    }
}
