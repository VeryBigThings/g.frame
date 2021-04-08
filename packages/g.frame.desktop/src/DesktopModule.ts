import {AbstractModule, AbstractModuleStatus, requires} from '@verybigthings/g.frame.core';
import {MouseActionController} from './controllers/MouseActionController';
import {OrbitControls} from './controls/OrbitControls';
import {InputModule} from '@verybigthings/g.frame.input';
import {KeyboardController} from './controllers/KeyboardController';
import {MousePickingController} from './controllers/MousePickingController';
import {PickingController} from '@verybigthings/g.frame.common.picking_controller';
import {IDesktopOptions} from './interfaces';

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
    private _pickingController: PickingController;
    private _cameraControls: OrbitControls;
    private config: IDesktopOptions;
    private _actionController: MouseActionController;
    private _keyboardController: KeyboardController;

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
        this._actionController = new MouseActionController(this.config.mouseActionController, data.viewer.renderer, data.viewer.camera);

        this._cameraControls = new OrbitControls(data.viewer.camera, data.viewer.renderer.domElement);
        this._keyboardController = new KeyboardController();
        this._pickingController = new MousePickingController(data, this.config.mousePickingController, this._actionController);
        return [
            this._actionController,
            this._cameraControls,
            this._keyboardController,
            this._pickingController
        ];
    }

    afterInit(): void {
        // console.info('Module after initialization. Here you can start save the World.');

        // @ts-ignore
        if (this._pickingController.init) this._pickingController.init(this._cameraControls);
        // TODO: Add controls agent after merge
        this._pickingController.enabled = true;
    }

    get pickingController(): PickingController {
        return this._pickingController;
    }

    set pickingController(value: PickingController) {
        console.error('You are trying to redefine instance in DesktopModule');
    }

    get cameraControls(): OrbitControls {
        return this._cameraControls;
    }

    set cameraControls(value: OrbitControls) {
        console.error('You are trying to redefine instance in DesktopModule');
    }

    get actionController(): MouseActionController {
        return this._actionController;
    }

    set actionController(value: MouseActionController) {
        console.error('You are trying to redefine instance in DesktopModule');
    }

    get keyboardController(): KeyboardController {
        return this._keyboardController;
    }

    set keyboardController(value: KeyboardController) {
        console.error('You are trying to redefine instance in DesktopModule');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
    }

    onDestroy(): void {
        // console.info('Module destroy function. Use it to destroy and dispose instances.');
        this._keyboardController.dispose();
        this._keyboardController.dispose();
        this._actionController.dispose();
    }

    onResume(): void {
    }

    onPause(): void {
    }
}
