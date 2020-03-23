import {Object3D} from 'three';

export class PhysicMeshUpdaterClass {
    private objects: Array<Object3D>;

    constructor() {
        this.objects = [];
    }

    register(obj: Object3D) {
        if (!obj.userData.physics) return;
        if (this.objects.indexOf(obj) > -1) return;
        this.objects.push(obj);
    }

    remove(obj: Object3D) {
        if (this.objects.indexOf(obj) > -1) return;
        this.objects.splice(this.objects.indexOf(obj), 1);
    }

    update() {
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            if (obj.userData.physics) {
                obj.position.copy(obj.userData.physics.getPosition());
                obj.quaternion.copy(obj.userData.physics.getOrientation());
            }
        }
    }
}

export const PhysicMeshUpdater = new PhysicMeshUpdaterClass();