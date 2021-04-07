import {Quaternion, Vector3} from 'three';
import {CameraControls} from './CameraControls';
import {Constructor} from '@verybigthings/g.frame.core';

export class CameraControlsAgent extends CameraControls {

    constructor(private instances: Array<CameraControls>) {
        super();
    }

    getSpecific<T extends CameraControls>(constructorFunction: Constructor<T>): T {
        for (let i = 0; i < this.instances.length; i++) {
            if (Object.getPrototypeOf(this.instances[i]).constructor === constructorFunction) return <T>this.instances[i];
        }
    }

    setOrientation(newOrientation: Quaternion) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setOrientation(newOrientation);
        }
    }

    getOrientation(): Quaternion {
        for (let i = 0; i < this.instances.length; i++) {
            const quaternion = this.instances[i].getOrientation();
            if (quaternion) return quaternion;
        }
    }

    setPositions(positionsMap: {
        [platformName: string]: Vector3 | Array<number> | number | { x: number; y: number; z: number }
    }): void {
        for (let i = 0; i < this.instances.length; i++) {
            const platform = this.instances[i].platform;
            if (positionsMap.hasOwnProperty(platform)) {
                let position: Vector3;
                if (positionsMap[platform] instanceof Array) {
                    position = new Vector3(positionsMap[platform][0], positionsMap[platform][1], positionsMap[platform][2]);
                } else if (typeof positionsMap[platform] === 'number') {
                    position = new Vector3(<number>positionsMap[platform], <number>positionsMap[platform], <number>positionsMap[platform]);
                } else if (positionsMap[platform] instanceof Vector3) {
                    position = new Vector3().copy(<Vector3>positionsMap[platform]);
                }

                this.instances[i].copyPosition(position);
            }
        }
    }

    setPitch(pitch: number) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setPitch(pitch);
        }
    }

    setYaw(yaw: number) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setYaw(yaw);
        }
    }

    setRoll(roll: number) {
        for (let i = 0; i < this.instances.length; i++) {
            this.instances[i].setRoll(roll);
        }
    }

    getPitch(): number {
        for (let i = 0; i < this.instances.length; i++) {
            const pitch = this.instances[i].getPitch();
            if (!isNaN(pitch)) return pitch;
        }
    }

    getYaw(): number {
        for (let i = 0; i < this.instances.length; i++) {
            const yaw = this.instances[i].getYaw();
            if (yaw) return yaw;
        }
    }

    getRoll(): number {
        for (let i = 0; i < this.instances.length; i++) {
            const roll = this.instances[i].getRoll();
            if (!isNaN(roll)) return roll;
        }
    }

}

CameraControls.prototype.__agentConstructor = CameraControlsAgent;