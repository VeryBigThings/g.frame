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
import {Object3D} from 'three';

@requires({
    modules: [
        InputModule
    ]
})
export class VirtualKeyboardModule extends AbstractModule {
    private virtualKeyboardComponentFactory: VirtualKeyboardComponentFactory;
    private virtualKeyboard: VirtualKeyboard;
    private readonly container: Object3D;

    constructor() {
        super();
        this.container = new Object3D();
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
            this.virtualKeyboard = new VirtualKeyboard(this.container),
        ];
    }

    afterInit(agents: AgentsStorage, modules: ModulesStorage): void {
        const actionController = agents.getAgent(ActionController);
        this.virtualKeyboardComponentFactory.setActionController(actionController);
        const inputManager = modules.getModule(InputModule).inputManager;
        this.virtualKeyboard.setInputManager(inputManager);
        this.virtualKeyboard.setKeyboardFactory(this.virtualKeyboardComponentFactory);
    }

    getModuleContainer(): Object3D | void {
        return this.container;
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