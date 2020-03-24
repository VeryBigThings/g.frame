import {AbstractModule, AbstractModuleStatus, ActionController} from '@verybigthings/g.frame.core';
import {WindowComponentFactory} from './WindowComponentFactory';

export class WindowComponentModule extends AbstractModule {
    private windowComponentFactory: WindowComponentFactory;

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
            this.windowComponentFactory = new WindowComponentFactory()
        ];
    }

    afterInit(agents: Map<any, any>): void {
        this.windowComponentFactory.setActionController(agents.get(ActionController));
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