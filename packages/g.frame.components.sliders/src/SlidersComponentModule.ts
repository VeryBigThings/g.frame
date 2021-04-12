import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from 'g.frame.core';
import {SliderComponentFactory} from './SliderComponentFactory';
import {CircleSliderComponentFactory} from './CircleSliderComponentFactory';
import {TorusComponentFactory} from './TorusComponentFactory';
import {ActionController} from 'g.frame.common.action_controller';


export class SlidersComponentModule extends AbstractModule {
    private sliderComponentFactory: SliderComponentFactory;
    private circleSliderComponentFactory: CircleSliderComponentFactory;
    private torusComponentFactory: TorusComponentFactory;

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
            this.sliderComponentFactory = new SliderComponentFactory(),
            this.circleSliderComponentFactory = new CircleSliderComponentFactory(),
            this.torusComponentFactory = new TorusComponentFactory()
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        const actionController = agents.get(ActionController);
        this.sliderComponentFactory.setActionController(actionController);
        this.circleSliderComponentFactory.setActionController(actionController);
        this.torusComponentFactory.setActionController(actionController);
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