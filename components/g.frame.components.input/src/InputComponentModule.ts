import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap, requires} from '@g.frame/core';
import {InputComponentFactory} from './InputComponentFactory';
import {InputModule} from '@g.frame/input';
import {ActionController} from '@g.frame/common.action_controller';

@requires({
    modules: [
        InputModule
    ]
})
export class InputComponentModule extends AbstractModule {
    private inputComponentFactory: InputComponentFactory;

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
            this.inputComponentFactory = new InputComponentFactory(),
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>, modules: ConstructorInstanceMap<AbstractModule>): void {
        const actionController = agents.get(ActionController);
        this.inputComponentFactory.setActionController(actionController);
        const inputManager = modules.get(InputModule).inputManager;
        this.inputComponentFactory.setInputManager(inputManager);
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