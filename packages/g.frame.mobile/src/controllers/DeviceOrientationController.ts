import { MeshEventDispatcher } from '@verybigthings/g.frame.core';
import { Camera, MathUtils, Quaternion, Euler, Vector3 } from 'three';

export class DeviceOrientationController extends MeshEventDispatcher {
    private camera: Camera;
    private enabled: boolean;
    private deviceOrientation: any;
    private screenOrientation: number;
    private alphaOffset: number;
    private onDeviceOrientationChangeEvent: (event) => void;

    constructor(camera: Camera) {
        super();

        this.camera = camera;
        this.camera.rotation.reorder('YXZ');

        this.alphaOffset = 0; // radians

        this.onDeviceOrientationChangeEvent = (event) => {
            this.deviceOrientation = event;
        };
    }

    update() {
        if (this.enabled === false) return;
        const device = this.deviceOrientation;

        if (device) {
            const alpha = device.alpha ? MathUtils.degToRad(device.alpha) + this.alphaOffset : 0; // Z
            const beta = device.beta ? MathUtils.degToRad(device.beta) : 0; // X
            const gamma = device.gamma ? MathUtils.degToRad(device.gamma) : 0; // Y

            const orient = this.screenOrientation ? MathUtils.degToRad(this.screenOrientation) : 0; // O
            this.setObjectQuaternion(this.camera.quaternion, alpha, beta, gamma, orient);
        }
    }

    /**
     * 
     */
    connect() {
        window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
        this.enabled = true;
    }

    disconnect() {
        window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
        this.enabled = false;
    }

    dispose() {
        this.disconnect();
    }

    private setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {
        const zee = new Vector3(0, 0, 1);
        const euler = new Euler();
        const q0 = new Quaternion();
        const q1 = new Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

        euler.set(beta, alpha, - gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
        quaternion.setFromEuler(euler); // orient the device
        quaternion.multiply(q1); // camera looks out the back of the device, not the top
        quaternion.multiply(q0.setFromAxisAngle(zee, - orient)); // adjust for screen orientation

    }
}