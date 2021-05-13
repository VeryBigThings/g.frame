import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@g.frame/core';
import {Object3D} from 'three';
import {ActionController} from '@g.frame/common.action_controller';
import {PhysicsExample} from './PhysicsExample';
import {OimoMousePuller, OimoPhysicsModule, PhysicMeshUpdater, WorldFactory} from '@g.frame/physics.oimo';
import {oimo} from 'oimophysics';
import Vec3 = oimo.common.Vec3;
import BroadPhaseType = oimo.collision.broadphase.BroadPhaseType;
import {DesktopModule} from '@g.frame/desktop';
import FrameworkViewer from '@g.frame/core/build/main/rendering/Viewer';
import PhysicsJointsExample from './PhysicsJointsExample';
import PhysicsBridgeExample from './PhysicsBridgeExample';
import PhysicsSpringExample from './PhysicsSpringExample';
import PhysicsVariableTimeStepExample from './PhysicsVariableTimeStepExample';
import PhysicsGearsExample from './PhysicsGearsExample';
import PhysicsFrictionsAndRestitutionsExample from './PhysicsFrictionsAndRestitutionsExample';
import PhysicsCollisionFilteringExample from './PhysicsCollisionFilteringExample';
import PhysicsFallingRagdollExample from './PhysicsFallingRagdollExample';
import PhysicsRagdollExample from './PhysicsRagdollExample';
import PhysicsCompoundShapesExample from './PhysicsCompoundShapesExample';
import PhysicsConvexHullExample from './PhysicsConvexHullExample';
import PhysicsVerticalStackingExample from './PhysicsVerticalStackingExample';
import PhysicsLimitRotationExample from './PhysicsLimitRotationExample';
import PhysicsBroadPhaseStressExample from './PhysicsBroadPhaseStressExample';
import PhysicsRayCastingExample from './PhysicsRayCastingExample';
import PhysicsConvexCastingExample from './PhysicsConvexCastingExample';
import PhysicsBreakableJointExample from './PhysicsBreakableJointExample';
import PhysicsGravityExample from './PhysicsGravityExample';
import PhysicsLinksExample from './PhysicsLinksExample';


const delay = async time => new Promise(resolve => setTimeout(resolve, time));


export class TemplateModule extends AbstractModule {
    public example: PhysicsExample;
    private readonly container: Object3D;
    public viewer: FrameworkViewer;

    constructor() {
        super();
        this.container = new Object3D();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.info('Module pre initialization.. Just make sure, that module is supported.');
        await delay(100);
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        console.info('Module initialization. Create all instances.');
        this.viewer = data.viewer;
        return [
            // this.example = new PhysicsBreakableJointExample(),
            // this.example = new PhysicsGravityExample(),
            // this.example = new PhysicsJointsExample(),
            // this.example = new PhysicsBridgeExample(),
            // this.example = new PhysicsSpringExample(),
            // this.example = new PhysicsVariableTimeStepExample(), // ====
            // this.example = new PhysicsFrictionsAndRestitutionsExample(),
            // this.example = new PhysicsCollisionFilteringExample(),
            // this.example = new PhysicsRagdollExample(),
            // this.example = new PhysicsFallingRagdollExample(),
            // this.example = new PhysicsVerticalStackingExample(),
            // this.example = new PhysicsLimitRotationExample(),
            // this.example = new PhysicsBroadPhaseStressExample(), // =======
            // this.example = new PhysicsRayCastingExample(),
            // this.example = new PhysicsConvexCastingExample(),
            // this.example = new PhysicsCompoundShapesExample(),
            // this.example = new PhysicsConvexHullExample(),
            this.example = new PhysicsGearsExample(),
            // this.example = new PhysicsLinksExample(),
        ];
    }

    getModuleContainer(): Object3D | void {
        return this.container;
    }

    afterInit(agents: ConstructorInstanceMap<any>, modules: ConstructorInstanceMap<AbstractModule>): void {
        const actionController = agents.get(ActionController);
        const physicsModule = (<OimoPhysicsModule>modules.get(OimoPhysicsModule));
        const world = (<WorldFactory>physicsModule.worldFactory).get({
            broadPhaseType: BroadPhaseType.BVH,
            gravity: new Vec3(0, -9, 0)
        });
        const mousePuller = (<OimoMousePuller>physicsModule.oimoMousePuller);
        // @ts-ignore
        mousePuller.init(world, actionController, modules.get(DesktopModule).cameraControls, this.viewer.scene, this.viewer.camera);
        this.example.init(actionController, (<PhysicMeshUpdater>physicsModule.physicMeshUpdater), world, mousePuller, this.container, this.viewer.camera);

        console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        this.example.update();
    }

    onDestroy(): void {
        console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}
