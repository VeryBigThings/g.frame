import {BoxGeometry, DirectionalLight, Mesh, Object3D, Vector3, PerspectiveCamera} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import OBoxGeometry = oimo.collision.geometry.BoxGeometry;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import {lines, triangles, OimoMousePuller, PhysicMeshUpdater, WorldFactory, OimoUtil} from '@g.frame/physics.oimo';
import {PhysicsExample} from './PhysicsExample';
import {
    ActionController,
    ActionControllerEvent,
    ActionControllerEventName
} from '@g.frame/common.action_controller';


export default class PhysicsGravityExample extends PhysicsExample {
    private decal: Vector3;

    constructor() {
        super();

        const directionLight = new DirectionalLight(0xffffff, 0.2);
        directionLight.position.set(6, 100, 10);
        this.addObject(directionLight);

        this.cameraPosition = new Vector3(0, 2.271217166830045, 11.00889126950031);
        this.cameraTargetNormal = new Vector3(0, 1.9564181483126553, 10.27582224845674);
    }

    init(actionController: ActionController, physicMeshUpdater: PhysicMeshUpdater, world: World, mousePuller: OimoMousePuller, container: Object3D, camera: PerspectiveCamera) {
        super.init(actionController, physicMeshUpdater, world, mousePuller, container, camera);

        this.decal = new Vector3(0, 1, 0);

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
        this.camera.position.set(0, 5, 7);
        this.camera.lookAt(0, 2, 0);

        const thickness: number = 0.5;
        const ground = this.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(7, thickness, 7), true);

        for (let i = 0; i < 12; i++) {
            let obj = this.addBox(this.world, new Vec3(0, (12 - i + 1) * 0.4, 0), new Vec3(0.25, 0.25, 0.25), false);

            if (obj.meshBox) this.actionController.on(ActionControllerEventName.click, obj.meshBox, (event: ActionControllerEvent) => {
                console.log(event);

                // const pos = event.point.clone();
                // const normal = event.ray.direction.clone().multiplyScalar(0.05);
                // obj.physics.applyImpulse(new Vec3(normal.x, normal.y, normal.z), new Vec3(pos.x, pos.y, pos.z));
            });
        }

    }


    public addBox(w: World, center: Vec3, halfExtents: Vec3, wall: boolean): { physics: RigidBody, meshBox: Mesh } {
        const meshBox = new Mesh(new BoxGeometry(halfExtents.x, halfExtents.y, halfExtents.z));
        meshBox.position.set(center.x, center.y, center.z);

        // this.addObject(meshBox);


        const physics = OimoUtil.addRigidBody(w, center, new OBoxGeometry(new Vec3(halfExtents.x / 2, halfExtents.y / 2, halfExtents.z / 2)), wall);
        meshBox.userData.physics = physics;
        this.physicMeshUpdater.register(meshBox);
        return {
            physics: physics,
            meshBox: meshBox
        };
    }


    update(): void {
        this.world.step(1 / 60);
        this.world.debugDraw();
    }
}
