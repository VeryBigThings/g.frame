import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {InputComponent} from './InputComponent';
import {IInputComponentOptions} from './interfaces';
import {InputManager} from '@verybigthings/g.frame.input';

export class InputComponentFactory extends Factory<InputComponent> {
    __constructor: typeof InputComponent = InputComponent;
    private components: Array<InputComponent>;
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

    get(params: IInputComponentOptions): InputComponent {
        const component = new InputComponent(params, this.actionController, this.inputManager);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: InputComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}