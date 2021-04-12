import {AbstractModule, AbstractModuleStatus} from '@verybigthings/g.frame.core';
import {GamepadModel} from './GamepadModel';
import {GamepadEvents} from './AbstractGamepad';

export class GamepadModule extends AbstractModule {
    public gamepadController: GamepadModel;

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
        this.gamepadController = new GamepadModel();

        return [
            this.gamepadController
        ];
    }

    afterInit(): void {
        // this.gamepadController.on(GamepadEvents.keyPressed, (event) => console.log('>>>', event));
        // console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        this.gamepadController.updateGamepad();
        // console.info('Module on update function. Use it to update instances.');
    }

    onDestroy(): void {
        // console.info('Module destroy function. Use it to destroy and dispose instances.');
        this.gamepadController.dispose();
    }

    onResume(): void {
    }

    onPause(): void {
    }
}
