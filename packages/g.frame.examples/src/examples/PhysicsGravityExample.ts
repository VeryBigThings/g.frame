import {oimo} from 'oimophysics';
import {beforeRender, lines, triangles} from '@verybigthings/g.frame.physics.oimo/src/three.debugger';
import {BoxGeometry, DirectionalLight, Mesh, Vector3} from 'three';
import OimoUtil from '@verybigthings/g.frame.physics.oimo/src/oimo.utils/OimoUtil';
import {PhysicMeshUpdater} from '@verybigthings/g.frame.physics.oimo/src/three.utils/PhysicMeshUpdater';
import World = oimo.dynamics.World;
import Vec3 = oimo.common.Vec3;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import OBoxGeometry = oimo.collision.geometry.BoxGeometry;
import BroadPhaseType = oimo.collision.broadphase.BroadPhaseType;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import {OimoMousePuller} from '@verybigthings/g.frame.physics.oimo/src/three.utils/OimoMousePuller';
import { Level } from '@verybigthings/g.frame.common.level_manager/src';
import { ModulesProcessor, ParentEvent } from '@verybigthings/g.frame.core';
import { ActionController, ActionControllerEventName, ActionControllerEvent } from '@verybigthings/g.frame.common.action_controller';

export default class PhysicsGravityExample extends Level {
    private modulesProcessor: ModulesProcessor;

    // physic
    private world: World;

    private decal: Vector3;

    constructor(modulesProcessor: ModulesProcessor) {
        super();
        this.modulesProcessor = modulesProcessor;

        const directionLight = new DirectionalLight(0xffffff, 0.2);
        directionLight.position.set(6, 100, 10);
        this.addObject(directionLight);

        // this.cameraPosition = new Vector3(0, 2.271217166830045, 11.00889126950031);
        // this.cameraTargetNormal = new Vector3(0, 1.9564181483126553, 10.27582224845674);
    }

    init(event: ParentEvent<string>) {
        super.init(event);

        this.decal = new Vector3(0, 1, 0);

        this.initPhysic();
        this.addDemo();

        OimoMousePuller.init(this.world);
    }


    initPhysic() {
        const Viewer = this.modulesProcessor.viewer;

        Viewer.scene.add(lines);
        Viewer.scene.add(triangles);


        this.world = new World(BroadPhaseType.BVH, new Vec3(0, -9.8, 0));


        if (!this.world.getDebugDraw()) {
            this.world.setDebugDraw(new DebugDraw());
        }
        this.world.getDebugDraw().drawJointLimits = true;

        Viewer.on('update', (event) => {
            this.world.step(1 / 30);
            this.world.debugDraw();
        });



    }

    addDemo() {
        const thickness: number = 0.5;

        const ground = this.addBox(this.world, new Vec3(0, -thickness, 0), new Vec3(7, thickness, 7), true);

        for (let i = 0; i < 12; i++) {
            let obj = this.addBox(this.world, new Vec3(0, (12 - i + 1) * 0.4, 0), new Vec3(0.25, 0.25, 0.25), false);

            if (obj.meshBox) this.modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.click, obj.meshBox, (event: ActionControllerEvent) => {
                // const pos = event.point.clone();
                // const normal = event.ray.direction.clone().multiplyScalar(0.05);
                // obj.physics.applyImpulse(new Vec3(normal.x, normal.y, normal.z), new Vec3(pos.x, pos.y, pos.z));
            });
        }

    }


    public addBox(w: World, center: Vec3, halfExtents: Vec3, wall: boolean): { physics: RigidBody, meshBox: Mesh } {
        const meshBox = new Mesh(new BoxGeometry(halfExtents.x, halfExtents.y, halfExtents.z));
        meshBox.position.set(center.x, center.y, center.z);

        this.addObject(meshBox);

        const physics = OimoUtil.addRigidBody(w, center, new OBoxGeometry(new Vec3(halfExtents.x / 2, halfExtents.y / 2, halfExtents.z / 2)), wall);
        meshBox.userData.physics = physics;
        // PhysicMeshUpdater.register(meshBox);
        return {
            physics: physics,
            meshBox: meshBox
        };
    }


    public randVec3In(min: number, max: number): Vec3 {

        return new Vec3(min + Math.random() * (max - min), min + Math.random() * (max - min), min + Math.random() * (max - min));
    }


    startAnimation(): Promise<any> {
        return super.startAnimation().then(() => {
        });
    }

    endAnimation(): Promise<any> {
        return super.endAnimation().then(() => {
        });
    }
}