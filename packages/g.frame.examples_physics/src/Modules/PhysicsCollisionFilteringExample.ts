import {BoxGeometry, DirectionalLight, Mesh, Object3D, Vector3, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import MathUtil = oimo.common.MathUtil;
import Shape = oimo.dynamics.rigidbody.Shape;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {ActionController} from '@g.frame/common.action_controller';

export default class PhysicsCollisionFilteringExample extends PhysicsExample {
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
        this.camera.position.set(0, 7, 9);
        this.camera.lookAt(0, 2, 0);

        const G_FLOOR: number = 1;
        const G_WALL: number = 2;
        const G_BALL: number = 4;
        const G_BOX: number = 8;


        const thickness: number = 0.5;
        const floorShape: Shape = OimoUtil.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(7, thickness, 7), true).getShapeList();
        floorShape.setCollisionGroup(G_FLOOR); // belongs to group FLOOR
        floorShape.setCollisionMask(G_BOX);    // collides to group BOX

        const wallShape: Shape = OimoUtil.addBox(this.world, new Vec3(0, 2, 0), new Vec3(3, 0.2, 3), true).getShapeList();
        wallShape.setCollisionGroup(G_WALL); // belongs to group WALL
        wallShape.setCollisionMask(G_BALL);  // collides to group BALL

        const w: number = 2;
        const h: number = 2;
        const n: number = 2;
        const size: number = 0.3;
        for (let i = 0; i < n; i++) {
            for (let j = -w; j < w + 1; j++) {
                for (let k = -h; k < h + 1; k++) {
                    const pos: Vec3 = new Vec3(j * size * 3, 3 + i * size * 3, k * size * 3);
                    pos.addEq(MathUtil.randVec3In(-0.01, 0.01));
                    let shape: Shape;
                    if (i === 0) {
                        shape = OimoUtil.addSphere(this.world, pos, size, false).getShapeList();
                        shape.setCollisionGroup(G_BALL);                 // belongs to group BALL
                        shape.setCollisionMask(G_WALL | G_BALL | G_BOX); // collides to group WALL, BALL and BOX
                    } else {
                        shape = OimoUtil.addBox(this.world, pos, new Vec3(size, size, size), false).getShapeList();
                        shape.setCollisionGroup(G_BOX);                   // belongs to group BOX
                        shape.setCollisionMask(G_FLOOR | G_BALL | G_BOX); // collides to group FLOOR, BALL and BOX
                    }
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
