import {AbstractModule, AbstractModuleStatus, ActionController, AgentsStorage} from '@verybigthings/g.frame.core';
import {DividedCircleComponentFactory} from './DividedCircleComponentFactory';
import {MultipleCircleMenuComponentFactory} from './MultipleCircleMenuComponentFactory';

export class DividedCircleComponentModule extends AbstractModule {
    private dividedCircleComponentFactory: DividedCircleComponentFactory;
    private multipleCircleMenuComponentFactory: MultipleCircleMenuComponentFactory;

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
            this.dividedCircleComponentFactory = new DividedCircleComponentFactory(),
            this.multipleCircleMenuComponentFactory = new MultipleCircleMenuComponentFactory()
        ];
    }

    afterInit(agents: AgentsStorage): void {
        const actionController = agents.getAgent(ActionController);
        this.dividedCircleComponentFactory.setActionController(actionController);
        this.multipleCircleMenuComponentFactory.setActionController(actionController);
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