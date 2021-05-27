import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@g.frame/core';
import {DividedCircleComponentFactory} from './DividedCircleComponentFactory';
import {MultipleCircleMenuComponentFactory} from './MultipleCircleMenuComponentFactory';
import {CirclePreloaderComponentFactory} from './CirclePreloaderComponentFactory';
import {ActionController} from '@g.frame/common.action_controller';

export class DividedCircleComponentModule extends AbstractModule {
    private dividedCircleComponentFactory: DividedCircleComponentFactory;
    private multipleCircleMenuComponentFactory: MultipleCircleMenuComponentFactory;
    private circlePreloaderComponentFactory: CirclePreloaderComponentFactory;

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
            this.circlePreloaderComponentFactory = new CirclePreloaderComponentFactory(),
            this.multipleCircleMenuComponentFactory = new MultipleCircleMenuComponentFactory()
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        const actionController = agents.get(ActionController);
        this.dividedCircleComponentFactory.setActionController(actionController);
        this.multipleCircleMenuComponentFactory.setActionController(actionController);
        this.circlePreloaderComponentFactory.setActionController(actionController);
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