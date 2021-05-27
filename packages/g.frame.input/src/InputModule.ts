import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@g.frame/core';
import {InputManager, Keyboard} from './common';

export class InputModule extends AbstractModule {
    public inputManager: InputManager;

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
            this.inputManager = new InputManager()
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.inputManager.keyboard = agents.get(Keyboard);
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