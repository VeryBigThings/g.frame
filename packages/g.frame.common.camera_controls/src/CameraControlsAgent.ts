import {Vector3} from 'three';
import {CameraControls} from './CameraControls';

export class CameraControlsAgent extends CameraControls {

    constructor(private instances: Array<CameraControls>) {
        super();
    }

    setPosition(newPosition: Vector3) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setPosition(newPosition);
        }
    }

    getPosition(): Vector3 {
        for (let i = 0; i < this.instances.length; i++) {
            const position = this.instances[i].getPosition();
            if (position) return position;
        }
    }

    setOrientation(newOrientation: Vector3) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setOrientation(newOrientation);
        }
    }

    getOrientation(): Vector3 {
        for (let i = 0; i < this.instances.length; i++) {
            const orientation = this.instances[i].getOrientation();
            if (orientation) return orientation;
        }
    }

    setPitchDegree(newPitch: number) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setPitchDegree(newPitch);
        }
    }

    setYaw(newYaw: number) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setYaw(newYaw);
        }
    }

    setRoll(newRoll: number) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setRoll(newRoll);
        }
    }
}

CameraControls.prototype.__agentConstructor = CameraControlsAgent;