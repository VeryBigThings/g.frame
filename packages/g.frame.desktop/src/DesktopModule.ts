import {AbstractModule, AbstractModuleStatus, requires} from '@verybigthings/g.frame.core';
import {IMouseActionControllerConfig, MouseActionController} from './controllers/MouseActionController';
import {OrbitControls} from './controls/OrbitControls';
import {InputModule} from '@verybigthings/g.frame.input';
import {KeyboardController} from './controllers/KeyboardController';
import {MousePickingController} from './controllers/MousePickingController';
import {IPickingControllerConfig} from '@verybigthings/g.frame.common.picking_controller';

@requires({
    modules: [
        InputModule
    ]
})

interface IDesktopOptions {
    mouseActionController?: IMouseActionControllerConfig;
    mousePickingController?: IPickingControllerConfig;
}

export class DesktopModule extends AbstractModule {
    constructor(private config: IDesktopOptions) {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        // console.info('Module pre initialization.. Just make sure, that module is supported.');
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        // console.info('Module initialization. Create all instances.');
        const actionController = new MouseActionController({
            minRaycasterDistance: this.config.mouseActionController.minRaycasterDistance || 0,
            maxRaycasterDistance: this.config.mouseActionController.maxRaycasterDistance || Infinity
        }, data.viewer.renderer, data.viewer.camera);

        const controls = new OrbitControls(data.viewer.camera, data.viewer.renderer.domElement);
        return [
            actionController,
            controls,
            new KeyboardController(),
            new MousePickingController(data, {
                minPickingDistance: this.config.mousePickingController.minPickingDistance || .001,
                maxPickingDistance: this.config.mousePickingController.maxPickingDistance || 15,
                controllersQuantity: 1,
            }, actionController, controls)
        ];
    }

    afterInit(): void {
        // console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
    }

    onDestroy(): void {
        // console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}