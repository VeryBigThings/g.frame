import { AbstractModule, AbstractModuleStatus } from '@verybigthings/g.frame.core';
import { DeviceOrientationController } from './controllers/DeviceOrientationController';
import { TouchActionController } from './controllers/TouchActionController';
import {CameraWrapperControls} from '@verybigthings/g.frame.common.camera_controls';
import {XREvent} from '../../g.frame.common.xr_manager/build/main';

export class MobileModule extends AbstractModule {
    deviceOrientationController: DeviceOrientationController;

    constructor() {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.info('Module pre initialization.. Just make sure, that module is supported.');
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        // console.info('Module initialization. Create all instances.');
        this.deviceOrientationController = new DeviceOrientationController(data.viewer.camera);

        const something = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
        if (something) {
            this.deviceOrientationController.connect();
        }

        return [
            this.deviceOrientationController,
            new TouchActionController({
                minRaycasterDistance: 0,
                maxRaycasterDistance: Infinity
            }, data.viewer.renderer, data.viewer.camera),
            // CameraWrapperControls disabled as default. If you have no DesktopModule, enable it later on
            this.deviceOrientationController
        ];
    }

    afterInit(): void {
        // console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
        this.deviceOrientationController.update();
    }

    onDestroy(): void {
        console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}