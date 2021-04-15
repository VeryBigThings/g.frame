import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap, requires} from '@verybigthings/g.frame.core';
import {VirtualKeyboardComponentFactory} from './VirtualKeyboardComponentFactory';
import {InputModule} from '@verybigthings/g.frame.input';
import {VirtualKeyboard} from './VirtualKeyboard';
import {Object3D} from 'three';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';

@requires({
    modules: [
        InputModule
    ]
})
export class VirtualKeyboardModule extends AbstractModule {
    private virtualKeyboardComponentFactory: VirtualKeyboardComponentFactory;
    private _virtualKeyboard: VirtualKeyboard;
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
            this._virtualKeyboard = new VirtualKeyboard(this.container),
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>, modules: ConstructorInstanceMap<AbstractModule>): void {
        const actionController = agents.get(ActionController);
        this.virtualKeyboardComponentFactory.setActionController(actionController);
        const inputManager = modules.get(InputModule).inputManager;
        this._virtualKeyboard.setInputManager(inputManager);
        this._virtualKeyboard.setKeyboardFactory(this.virtualKeyboardComponentFactory);
    }

    get virtualKeyboard(): VirtualKeyboard {
        return this._virtualKeyboard;
    }

    set virtualKeyboard(value: VirtualKeyboard) {
        console.error('You are trying to redefine instance in VirtualKeyboardModule');
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
