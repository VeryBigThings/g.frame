import {oimo} from 'oimophysics';
import Vec3 = oimo.common.Vec3;
import RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
import RigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import World = oimo.dynamics.World;
import SphericalJoint = oimo.dynamics.constraint.joint.SphericalJoint;
import SphericalJointConfig = oimo.dynamics.constraint.joint.SphericalJointConfig;
import RayCastClosest = oimo.dynamics.callback.RayCastClosest;

class OimoMousePullerClass {
    world: World;
    count: number;
    mouseJointDummyBody: RigidBody;
    mouseJoint: SphericalJoint;
    previousSqueezed: boolean;


    constructor() {
        this.count = 0;
    }


    public init(world: World): void {
        this.world = world;
        const rigidBodyConfig: RigidBodyConfig = new RigidBodyConfig();
        rigidBodyConfig.type = RigidBodyType.STATIC;
        this.mouseJointDummyBody = new RigidBody(rigidBodyConfig);
        this.mouseJoint = null;
        this.previousSqueezed = false;

        let squeezed = false, moveCallback, upCallback;
        // Viewer.actionController.on(ActionControllerEventName.buttonDown, null, (event: ActionControllerEvent) => {
        //     squeezed = true;
        //     const position = new Vec3(0, 0, 0);
        //     const intersected = this.updateMouseJoint(squeezed, position, new Vec3(event.ray.origin.x, event.ray.origin.y, event.ray.origin.z), new Vec3(event.ray.direction.x, event.ray.direction.y, event.ray.direction.z));
        //     if (intersected) {
        //         Viewer.controls.enabled = false;
        //         let plane;
        //         Viewer.scene.add(plane = new Mesh(new PlaneGeometry(1000, 1000), new MeshBasicMaterial({visible: false})));
        //         plane.position.set(position.x, position.y, position.z);
        //         plane.lookAt(Viewer.camera.localToWorld(new Vector3()));
        //         Viewer.actionController.once(ActionControllerEventName.buttonUp, null, (event: ActionControllerEvent) => {
        //             Viewer.actionController.off(ActionControllerEventName.move, plane, moveCallback);
        //             this.updateMouseJoint(false, new Vec3(null), new Vec3(null), new Vec3(null));
        //             Viewer.controls.enabled = true;
        //             Viewer.scene.remove(plane);
        //             plane.geometry.dispose();
        //             plane.material.dispose();
        //             plane = null;
        //             squeezed = false;
        //         });
        //         Viewer.actionController.on(ActionControllerEventName.move, plane, moveCallback = (event: ActionControllerEvent) => {
        //             this.updateMouseJoint(squeezed, new Vec3(event.point.x, event.point.y, event.point.z), new Vec3(event.ray.origin.x, event.ray.origin.y, event.ray.origin.z), new Vec3(event.ray.direction.x, event.ray.direction.y, event.ray.direction.z));
        //         });
        //
        //     }
        // });
    }

    updateMouseJoint(squeezed: boolean, newWorldPosition: Vec3, originPoint: Vec3, direction: Vec3): boolean {
        if (this.mouseJoint !== null) {
            if (squeezed) {
                this.mouseJointDummyBody.setPosition(newWorldPosition);
                this.mouseJoint.getRigidBody1().wakeUp();
                this.mouseJoint.getRigidBody2().wakeUp();
            } else {
                this.world.removeJoint(this.mouseJoint);
                this.mouseJoint = null;
            }
        } else {
            if (squeezed && !this.previousSqueezed) { // clicked
                // ray casting
                const end: Vec3 = originPoint.clone().add(direction.scale(500));

                const closest: RayCastClosest = new RayCastClosest();
                this.world.rayCast(originPoint, end, closest);

                if (!closest.hit) return;

                const body: RigidBody = closest.shape.getRigidBody();
                const position: Vec3 = closest.position;
                newWorldPosition.copyFrom(position);

                if (body == null || body.getType() !== RigidBodyType.DYNAMIC) return false;

                const jc: SphericalJointConfig = new SphericalJointConfig();
                jc.springDamper.frequency = 1;
                jc.springDamper.dampingRatio = 1;
                jc.rigidBody1 = body;
                jc.rigidBody2 = this.mouseJointDummyBody;
                jc.allowCollision = false;
                jc.localAnchor1 = position.sub(body.getPosition());
                jc.localAnchor1.mulMat3Eq(body.getRotation().transposeEq());
                jc.localAnchor2.zero();
                this.mouseJointDummyBody.setPosition(position);
                this.mouseJoint = new SphericalJoint(jc);
                this.world.addJoint(this.mouseJoint);
            }
        }

        this.previousSqueezed = squeezed;
        return true;
    }
}

const OimoMousePuller = new OimoMousePullerClass();
export {OimoMousePuller};
