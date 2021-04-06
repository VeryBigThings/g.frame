import {Object3D} from 'three';
import {oimo} from 'oimophysics';
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import {OimoUtil} from '../oimo.utils';

export enum PhysicMeshLinkType {
    DISABLED = 0,
    MESH_RIGID_BODY_FULL = 1,
    MESH_RIGID_BODY_POSITION = 2,
    MESH_RIGID_BODY_ORIENTATION = 3,
    RIGID_BODY_MESH_FULL = 4,
    RIGID_BODY_MESH_POSITION = 5,
    RIGID_BODY_MESH_ORIENTATION = 6
}

export class PhysicMeshUpdater {
    private links: Array<{object: Object3D, rigidBody: RigidBody, linkType: PhysicMeshLinkType}>;

    constructor() {
        this.links = [];
    }


    register(obj: Object3D, rigidBody?: RigidBody, linkType: PhysicMeshLinkType = PhysicMeshLinkType.RIGID_BODY_MESH_FULL) {
        this.links.push({
            object: obj,
            rigidBody,
            linkType
        });
    }

    remove(obj: Object3D) {
        for (let i = 0; i < this.links.length; i++) {
            if (this.links[i].object === obj) {
                this.links.splice(i, 1);
            }
        }
    }

    update() {
        for (let i = 0; i < this.links.length; i++) {
            const objLink = this.links[i];
            if (objLink.rigidBody) {
                if (PhysicMeshLinkType.DISABLED) continue;

                // RIGID_BODY => MESH ============
                if (PhysicMeshLinkType.RIGID_BODY_MESH_POSITION === objLink.linkType ||
                    PhysicMeshLinkType.RIGID_BODY_MESH_FULL === objLink.linkType
                ) {
                    objLink.object.position.copy(OimoUtil.vector3FromVec3(objLink.rigidBody.getPosition()));
                }

                if (PhysicMeshLinkType.RIGID_BODY_MESH_ORIENTATION === objLink.linkType ||
                    PhysicMeshLinkType.RIGID_BODY_MESH_FULL === objLink.linkType
                ) {
                    objLink.object.quaternion.copy(OimoUtil.quaternionFromQuat(objLink.rigidBody.getOrientation()));
                }


                // MESH => RIGID_BODY ============
                if (PhysicMeshLinkType.MESH_RIGID_BODY_POSITION === objLink.linkType ||
                    PhysicMeshLinkType.MESH_RIGID_BODY_FULL === objLink.linkType
                ) {
                    objLink.rigidBody.setLinearVelocity(objLink.rigidBody.getLinearVelocity().negate());
                    objLink.rigidBody.setPosition(OimoUtil.vec3FromVector3(objLink.object.position.clone()));
                }

                if (PhysicMeshLinkType.MESH_RIGID_BODY_ORIENTATION === objLink.linkType ||
                    PhysicMeshLinkType.MESH_RIGID_BODY_FULL === objLink.linkType
                ) {
                    objLink.rigidBody.setAngularVelocity(objLink.rigidBody.getAngularVelocity().negate());
                    objLink.rigidBody.setOrientation(OimoUtil.quatFromQuaternion(objLink.object.quaternion.clone()));
                }
            }
        }
    }
}

