import {Input, InputManager, Keyboard, KeyboardEvents} from 'g.frame.input';
import {VirtualKeyboardComponentFactory} from './VirtualKeyboardComponentFactory';
import {VirtualKeyboardComponent} from './VirtualKeyboardComponent';
import {Object3D, Quaternion, Vector3} from 'three';
import {ParentEvent} from 'g.frame.core';

export class VirtualKeyboard extends Keyboard {
    private inputManager: InputManager;
    private keyboardFactory: VirtualKeyboardComponentFactory;
    private currentKeyboard: VirtualKeyboardComponent;

    private readonly onInputChanged: () => void;

    constructor(private scene: Object3D) {
        super();
        this.onInputChanged = () => {
            const currentInput = this.inputManager.currentInput;
            this.disposeCurrentKeyboard();

            if (!currentInput) {
                return;
            }

            this.createNewKeyboard(currentInput);
        };
    }

    setInputManager(inputManager: InputManager) {
        this.inputManager = inputManager;
        this.inputManager.on('inputChanged', this.onInputChanged);
    }

    setKeyboardFactory(keyboardFactory: VirtualKeyboardComponentFactory) {
        this.keyboardFactory = keyboardFactory;
    }

    disposeCurrentKeyboard() {
        this.currentKeyboard?.dispose();
        this.currentKeyboard?.uiObject?.parent?.remove(this.currentKeyboard.uiObject);
    }

    createNewKeyboard(input: Input) {
        this.currentKeyboard = this.keyboardFactory.get({
            type: input.options.type,
            customWords: input.options.customWords,
            position: new Vector3(0, -5, 0),
            scale: new Vector3(0.5, 0.5, 0.5),
            orientation: new Quaternion(),
        });

        this.scene.add(this.currentKeyboard.uiObject);


        this.currentKeyboard.on(KeyboardEvents.onDelete, () => this.fire(KeyboardEvents.onDelete));
        this.currentKeyboard.on(KeyboardEvents.onEnterSymbol, (event: ParentEvent<KeyboardEvents>) => this.fire(KeyboardEvents.onEnterSymbol, event));
        this.currentKeyboard.on(KeyboardEvents.onUnFocus, () => this.fire(KeyboardEvents.onUnFocus));
        this.currentKeyboard.on(KeyboardEvents.onSubmit, () => this.fire(KeyboardEvents.onSubmit));
    }


}




















