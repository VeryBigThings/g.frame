import {AbstractModule, AbstractModuleStatus, requires, RenderModuleAbstract} from '@g.frame/core';
import {MouseActionController} from './controllers/MouseActionController';
import {OrbitControls} from './controls/OrbitControls';
import {InputModule} from '@g.frame/input';
import {KeyboardController} from './controllers/KeyboardController';
import {MousePickingController} from './controllers/MousePickingController';
import {PickingController} from '@g.frame/common.picking_controller';
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
        InputModule,
        RenderModuleAbstract
    ]
})

export class DesktopModule extends AbstractModule {
    private _pickingController: PickingController;
    private _cameraControls: OrbitControls;
    private _config: IDesktopOptions;
    private _actionController: MouseActionController;
    private _keyboardController: KeyboardController;

    constructor(config?: IDesktopOptions) {
        super();
        this._config = config || defaultConfig;
        this._config.mouseActionController = this._config.mouseActionController || defaultConfig.mouseActionController;
        this._config.mousePickingController = this._config.mousePickingController || defaultConfig.mousePickingController;
    }

    async preInit(): Promise<AbstractModuleStatus> {
        // console.info('Module pre initialization.. Just make sure, that module is supported.');
        return {
            enabled: true
        };
    }

    async onInit(data: Array<AbstractModule>): Promise<Array<any>> {
        const renderModule = data.find(module => {
            return module instanceof RenderModuleAbstract;
        }) as RenderModuleAbstract;

        const viewer = renderModule.getViewer();

        this._actionController = new MouseActionController(this.config.mouseActionController, viewer.renderer, viewer.camera);

        this._cameraControls = new OrbitControls(viewer.camera, viewer.renderer.domElement);

        this._keyboardController = new KeyboardController();

        this._pickingController = new MousePickingController(viewer, this.config.mousePickingController, this.actionController);
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

    get config(): IDesktopOptions {
        return this._config;
    }

    set config(value: IDesktopOptions) {
        console.error('You are trying to redefine instance in DesktopModule');
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
