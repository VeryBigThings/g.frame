import {AbstractModule, AbstractModuleStatus, ActionController} from '@verybigthings/g.frame.core';
import {ButtonComponentFactory} from './ButtonComponentFactory';
import {IconButtonComponentFactory} from './IconButtonComponentFactory';

export class ButtonsComponentModule extends AbstractModule {
    private buttonComponentFactory: ButtonComponentFactory;
    private iconButtonComponentFactory: IconButtonComponentFactory;

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
            this.buttonComponentFactory = new ButtonComponentFactory(),
            this.iconButtonComponentFactory = new IconButtonComponentFactory()
        ];
    }

    afterInit(agents: Map<any, any>): void {
        this.buttonComponentFactory.setActionController(agents.get(ActionController));
        this.iconButtonComponentFactory.setActionController(agents.get(ActionController));
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