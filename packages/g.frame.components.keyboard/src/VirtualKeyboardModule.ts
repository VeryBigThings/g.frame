import {
    AbstractModule,
    AbstractModuleStatus,
    ActionController,
    AgentsStorage,
    requires
} from '@verybigthings/g.frame.core';
import {VirtualKeyboardComponentFactory} from './VirtualKeyboardComponentFactory';
import {ModulesStorage} from '@verybigthings/g.frame.core/build/main/agents/ModulesStorage';
import {InputModule} from '@verybigthings/g.frame.input';
import {VirtualKeyboard} from './VirtualKeyboard';

@requires({
    modules: [
        InputModule
    ]
})
export class VirtualKeyboardModule extends AbstractModule {
    private virtualKeyboardComponentFactory: VirtualKeyboardComponentFactory;
    private virtualKeyboard: VirtualKeyboard;

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
            this.virtualKeyboardComponentFactory = new VirtualKeyboardComponentFactory(),
            this.virtualKeyboard = new VirtualKeyboard(data.viewer.scene),
        ];
    }

    afterInit(agents: AgentsStorage, modules: ModulesStorage): void {
        const actionController = agents.getAgent(ActionController);
        this.virtualKeyboardComponentFactory.setActionController(actionController);
        const inputManager = modules.getModule(InputModule).inputManager;
        this.virtualKeyboard.setInputManager(inputManager);
        this.virtualKeyboard.setKeyboardFactory(this.virtualKeyboardComponentFactory);
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