import {AbstractModule, AbstractModuleStatus, requires} from '@verybigthings/g.frame.core';
import {MouseActionController} from './controllers/MouseActionController';
import {OrbitControls} from './controls/OrbitControls';
import {InputModule} from '@verybigthings/g.frame.input';
import {KeyboardController} from './controllers/KeyboardController';
import {MousePickingController} from './controllers/MousePickingController';
import {PickingController} from '@verybigthings/g.frame.common.picking_controller';
import {IMousePickingControllerConfig, IDesktopOptions} from './interfaces';

const defaultConfig = {
    mouseActionController: {
        minRaycasterDistance: 0,
        maxRaycasterDistance: Infinity
    },
    mousePickingController: {
        minPickingDistance: .001,
        maxPickingDistance: 15,
        controllersQuantity: 1,
        offSet: 0.95
    }
};

@requires({
    modules: [
        InputModule
    ]
})

export class DesktopModule extends AbstractModule {
    private pickingController: PickingController;
    private cameraControls: OrbitControls;
    private config: IDesktopOptions;

    constructor(config?: IDesktopOptions) {
        super();
        this.config = config || defaultConfig;
        this.config.mouseActionController = this.config.mouseActionController || defaultConfig.mouseActionController;
        this.config.mousePickingController = this.config.mousePickingController || defaultConfig.mousePickingController;
    }

    async preInit(): Promise<AbstractModuleStatus> {
        // console.info('Module pre initialization.. Just make sure, that module is supported.');
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        // console.info('Module initialization. Create all instances.');
        const actionController = new MouseActionController(this.config.mouseActionController, data.viewer.renderer, data.viewer.camera);

        this.cameraControls = new OrbitControls(data.viewer.camera, data.viewer.renderer.domElement);
        return [
            actionController,
            this.cameraControls,
            new KeyboardController(),
            this.pickingController = new MousePickingController(data, this.config.mousePickingController, actionController)
        ];
    }

    afterInit(): void {
        // console.info('Module after initialization. Here you can start save the World.');

        // @ts-ignore
        if (this.pickingController.init) this.pickingController.init(this.cameraControls);
        // TODO: Add controls agent after merge
        this.pickingController.enabled = true;
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