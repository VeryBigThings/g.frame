import {Factory, ParentEvent, ViewerModule} from '@g.frame/core';
import {Object3D} from 'three';
import {InputManager} from '@g.frame/input';
import {VirtualKeyboardComponent} from './VirtualKeyboardComponent';
import {IVirtualKeyboardViewOptions} from './interfaces';
import {ActionController} from '@g.frame/common.action_controller';

export class VirtualKeyboardComponentFactory extends Factory<VirtualKeyboardComponent> {
    __constructor: typeof VirtualKeyboardComponent = VirtualKeyboardComponent;
    private components: Array<VirtualKeyboardComponent>;
    private actionController: ActionController;
    private inputManager: InputManager;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    setInputManager(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    get(params: IVirtualKeyboardViewOptions): VirtualKeyboardComponent {
        const component = new VirtualKeyboardComponent(params, this.actionController);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: VirtualKeyboardComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}