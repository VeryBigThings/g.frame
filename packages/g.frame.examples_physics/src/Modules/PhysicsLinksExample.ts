import App from '../ts/main';
import {Level, ParentEvent, Viewer} from '../../../src';
import {config} from '../ts/config';
import {lines, triangles} from '../../../src/ts/libs/oimo/OIMO_debugger';
import {BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, SphereGeometry, Vector3} from 'three';
import OimoUtil from '../../../src/ts/libs/oimo/OimoUtil';
import {PhysicMeshLinkType, PhysicMeshUpdater} from '../../../src/ts/libs/oimo/PhysicMeshUpdater';
import {OimoMousePuller} from '../../../src/ts/libs/oimo/OimoMousePuller';
import {oimo} from 'oimophysics';
import Vec3 = oimo.common.Vec3;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import OBoxGeometry = oimo.collision.geometry.BoxGeometry;
import OSphereGeometry = oimo.collision.geometry.SphereGeometry;
import BroadPhaseType = oimo.collision.broadphase.BroadPhaseType;
import RigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
import MathUtil = oimo.common.MathUtil;
import World = oimo.dynamics.World;
import RotationalLimitMotor = oimo.dynamics.constraint.joint.RotationalLimitMotor;
import SpringDamper = oimo.dynamics.constraint.joint.SpringDamper;
import TranslationalLimitMotor = oimo.dynamics.constraint.joint.TranslationalLimitMotor;
import DebugDraw = oimo.dynamics.common.DebugDraw;
import {vec3FromVector3} from '../../../src/ts/utils/PhysUtils';


export default class PhysicsLinksExample extends Level {
    public app: App;

    // physic
    private world: World;

    private decal: Vector3;

    constructor(app: App) {
        super(config);

        const directionLight = new DirectionalLight(0xffffff, 0.2);
        directionLight.position.set(6, 100, 10);
        this.addObject(directionLight);

        this.cameraPosition = new Vector3(0, 2.271217166830045, 11.00889126950031);
        this.cameraTargetNormal = new Vector3(0, 1.9564181483126553, 10.27582224845674);
    }

    init(event: ParentEvent) {
        super.init(event);

        this.decal = new Vector3(0, 1, 0);

        this.initPhysic();
        this.addDemo();

        OimoMousePuller.init(this.world);
    }


    initPhysic() {

        Viewer.scene.add(lines);
        Viewer.scene.add(triangles);


        this.world = new World(BroadPhaseType.BVH, new Vec3(0, -9.8, 0));


        if (!this.world.getDebugDraw()) {
            this.world.setDebugDraw(new DebugDraw());
        }
        this.world.getDebugDraw().drawJointLimits = true;

        Viewer.on('update', (event) => {
            this.world.step(1 / 60);
            this.world.debugDraw();
        });


    }

    addDemo() {
        const {physics: table} = this.addBox(this.world, new Vec3(0, -0.2, 0), new Vec3(6, 0.2, 6), true);

        this.createBallChainRotation(new Vec3(-2, 5, -2), 0.4, 7);


        const objects = this.addSphere(this.world, vec3FromVector3(new Vector3(0, 20, 0)), 1, false, PhysicMeshLinkType.MESH_RIGID_BODY_POSITION);
        console.log('objects', objects);
    }

    createBoard(x: number, y: number, z: number, lm: RotationalLimitMotor, sd: SpringDamper) {
        const {physics: b1} = this.addBox(this.world, new Vec3(x, y, z), new Vec3(0.1, 0.1, 0.1), true);
        const {physics: b2} = this.addBox(this.world, new Vec3(x + 0.5, y, z), new Vec3(0.5, 0.2, 0.4), false);
        OimoUtil.addRevoluteJoint(this.world, b1, b2, new Vec3(x, y, z), new Vec3(0, 0, 1), sd, lm);
    }

    createBallChainRotation(from: Vec3, radius: number, num: number): void {
        let b1: RigidBody;
        let b2: RigidBody;
        b1 = this.addSphere(this.world, from.clone(), radius * 0.9, true).physics;

        let localAnchor1 = new Vec3(0, 0, 0);
        let localAnchor2 = new Vec3(0, -radius * 2, 0);

        for (let i = 0; i < num; i++) {
            if (i === num - 1) {
                from.x += MathUtil.randIn(-0.001, 0.001);
                from.z += MathUtil.randIn(-0.001, 0.001);
            }
            from.y += radius * 2;
            b2 = this.addSphere(this.world, from.clone(), radius * 0.9, false, PhysicMeshLinkType.RIGID_BODY_MESH_POSITION).physics;

            OimoUtil.addSphericalJoint2(this.world, b1, b2, localAnchor1, localAnchor2);

            b1 = b2;
            localAnchor1.init(0, radius, 0);
            localAnchor2.init(0, -radius, 0);
        }
    }

    createHingeChain(from: Vec3, radius: number, num: number, axis: Vec3): void {


        let b1: RigidBody;
        let b2: RigidBody;
        b1 = this.addBox(this.world, from.clone(), new Vec3(radius * 2, radius * 2, radius * 2), true).physics;

        let localAnchor1 = new Vec3(0, 0, 0);
        let localAnchor2 = new Vec3(0, -radius * 2, 0);

        for (let i = 0; i < num; i++) {
            if (i === num - 1) {
                from.x += MathUtil.randIn(-0.001, 0.001);
                from.z += MathUtil.randIn(-0.001, 0.001);
            }
            from.y += radius * 2;
            b2 = this.addBox(this.world, from.clone(), new Vec3(radius * 0.5 * 2, radius * 0.9 * 2, radius * 0.9 * 2), false).physics;


            OimoUtil.addRevoluteJoint2(this.world, b1, b2, localAnchor1, localAnchor2, axis, axis);

            b1 = b2;
            localAnchor1.init(0, radius, 0);
            localAnchor2.init(0, -radius, 0);
        }
    }


    public addBox(w: World, center: Vec3, halfExtents: Vec3, wall: boolean): { physics: RigidBody, mesh: Mesh } {
        const meshBox = new Mesh(new BoxGeometry(halfExtents.x, halfExtents.y, halfExtents.z), new MeshBasicMaterial({color: 0xffffff * Math.random()}));
        meshBox.position.set(center.x, center.y, center.z);

        this.addObject(meshBox);

        const physics = OimoUtil.addRigidBody(w, center, new OBoxGeometry(new Vec3(halfExtents.x / 2, halfExtents.y / 2, halfExtents.z / 2)), wall);
        meshBox.userData.physics = physics;
        PhysicMeshUpdater.register(meshBox);
        return {
            physics: physics,
            mesh: meshBox
        };
    }


    public addSphere(w: World, center: Vec3, radius: number, wall: boolean, linkType: PhysicMeshLinkType = PhysicMeshLinkType.RIGID_BODY_MESH_FULL): { physics: RigidBody, mesh: Mesh } {
        const meshSphere = new Mesh(new SphereGeometry(radius), new MeshBasicMaterial({color: 0xffffff * Math.random()}));
        meshSphere.position.set(center.x, center.y, center.z);

        this.addObject(meshSphere);

        const physics = OimoUtil.addRigidBody(w, center, new OSphereGeometry(radius), wall);
        // meshSphere.userData.physics = physics;
        PhysicMeshUpdater.register(meshSphere, physics, linkType);
        return {
            physics: physics,
            mesh: meshSphere
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