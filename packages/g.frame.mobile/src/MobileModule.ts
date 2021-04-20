import {AbstractModule, AbstractModuleStatus} from '@g.frame/core';
import {TouchActionController} from './controllers/TouchActionController';


export class MobileModule extends AbstractModule {
    private _touchActionController: TouchActionController;
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
        return [
            this._touchActionController = new TouchActionController({
                minRaycasterDistance: 0,
                maxRaycasterDistance: Infinity
            }, data.viewer.renderer, data.viewer.camera),
        ];
    }

    afterInit(): void {
        console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
    }

    get touchActionController(): TouchActionController {
        return this._touchActionController;
    }

    set touchActionController(value: TouchActionController) {
        console.error('You are trying to redefine instance in MobileModule');
    }

    onDestroy(): void {
        this._touchActionController.dispose();
    }

    onResume(): void {
    }

    onPause(): void {
    }
}
