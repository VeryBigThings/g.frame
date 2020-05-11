import {AbstractModule, AbstractModuleStatus, requires} from '@verybigthings/g.frame.core';
import {MouseActionController} from './controllers/MouseActionController';
import {OrbitControls} from './controls/OrbitControls';
import {InputModule} from '@verybigthings/g.frame.input';
import {KeyboardController} from './controllers/KeyboardController';

@requires({
    modules: [
        InputModule
    ]
})
export class DesktopModule extends AbstractModule {
    constructor() {
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
        return [
            new MouseActionController({
                minRaycasterDistance: 0,
                maxRaycasterDistance: Infinity
            }, data.viewer.renderer, data.viewer.camera),
            new OrbitControls(data.viewer.camera, data.viewer.renderer.domElement),
            new KeyboardController()
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