import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@g.frame/core';
import {RadioGroupComponentFactory} from './RadioGroupComponentFactory';
import {CheckRadioComponentFactory} from './CheckRadioComponentFactory';
import {ActionController} from '@g.frame/common.action_controller';

export class RadiosComponentsModule extends AbstractModule {
    private radioGroupComponentFactory: RadioGroupComponentFactory;
    private checkRadioComponentFactory: CheckRadioComponentFactory;

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
            this.radioGroupComponentFactory = new RadioGroupComponentFactory(),
            this.checkRadioComponentFactory = new CheckRadioComponentFactory()
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        const actionController = agents.get(ActionController);
        this.radioGroupComponentFactory.setActionController(actionController);
        this.checkRadioComponentFactory.setActionController(actionController);
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