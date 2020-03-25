import {AbstractModule, AbstractModuleStatus, ActionController, AgentsStorage} from '@verybigthings/g.frame.core';
import {DepthScrollComponentFactory} from './DepthScrollComponentFactory';

export class DepthScrollComponentModule extends AbstractModule {
    private depthScrollComponentFactory: DepthScrollComponentFactory;

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
            this.depthScrollComponentFactory = new DepthScrollComponentFactory()
        ];
    }

    afterInit(agents: AgentsStorage): void {
        this.depthScrollComponentFactory.setActionController(agents.getAgent(ActionController));
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