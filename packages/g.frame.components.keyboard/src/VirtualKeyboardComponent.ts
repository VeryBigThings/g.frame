import {WindowComponent} from '@verybigthings/g.frame.components.window';
import {Box3, Object3D, Quaternion, Vector2, Vector3} from 'three';
import {ITextComponentOptions, TextComponent} from '@verybigthings/g.frame.components.text';
import {
    ActionController,
    ActionControllerEvent,
    ActionControllerEventName,
} from '@verybigthings/g.frame.common.action_controller';
import {ObjectsPositioning, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {InputType, KeyboardEvents} from '@verybigthings/g.frame.input';
import {IVirtualKeyboardViewOptions} from './interfaces';


export class VirtualKeyboardComponent extends ViewerModule {
    private letterKeyboard: ViewerModule;
    private symbolKeyboard: ViewerModule;

    private rightKeyboard: ViewerModule;
    private numberKeyboard: ViewerModule;

    private wordKeyboard: ViewerModule;

    private lettersKeyList: Array<TextComponent> = [];
    private symbolKeyList: Array<TextComponent> = [];
    private rightKeyList: Array<TextComponent> = [];
    private numberKeyList: Array<TextComponent> = [];
    private wordKeyList: Array<TextComponent> = [];

    private background: number = 0x36454c;
    private letterList: Array<string>;
    private symbolList: Array<string>;
    private rightList: Array<string>;
    private numberList: Array<string>;


    constructor(private options: IVirtualKeyboardViewOptions, private actionController: ActionController) {
        super();
        if (this.options.type === InputType.Full) {
            this.initLetterKeyboard();
            this.initNumberKeyboard();
        } else if (this.options.type === InputType.Letters) {
            this.initLetterKeyboard();
        } else if (this.options.type === InputType.Numbers) {
            this.initNumberKeyboard();

            this.numberKeyboard.uiObject.position.set(0, 0, 0);
            this.numberKeyboard.uiObject.rotateY(-0.2);
        } else if (this.options.type === InputType.Custom) {
            this.initWordKeyboard();
        }

        this.initRightKeyboard();


        this.uiObject.position.copy(this.options.position || new Vector3());
        this.uiObject.quaternion.copy(this.options.orientation || new Quaternion());
        this.uiObject.scale.copy(this.options.scale || new Vector3(1, 1, 1));

        // this.camera.parent.add(this.uiObject);
    }

    public show(show: boolean = true) {
        this.uiObject.visible = show;
    }

    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }

    private initWordKeyboard() {
        this.wordKeyboard = new ViewerModule();

        for (let i = 0; i < this.options.customWords.length - 1; i++) {
            const key = new TextComponent(this.getOptions(this.options.customWords[i]));

            this.initKeyEvents(key);
            key.uiObject.position.z += 0.01;
            this.wordKeyList.push(key);
            this.wordKeyboard.addObject(key);
        }

        ObjectsPositioning.adjustObjects(this.wordKeyList.map(a => a.uiObject), true, 0.1, 16);

        const b3 = new Box3();
        b3.setFromObject(this.wordKeyboard.uiObject);
        let wordKeySize = b3.getSize(new Vector3());
        wordKeySize.add(new Vector3(1, 1));

        this.wordKeyboard.addObject(new WindowComponent({
            size: new Vector2(wordKeySize.x, wordKeySize.y),
            background: 0x36454c,
            bordRadius: 0.3
        }));
        this.addObject(this.wordKeyboard);
    }

    private initLetterKeyboard() {
        this.letterList = [
            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
            '', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
            '', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '!', '?',
            '#+=', '@', ' ', ',', '.', '3'
        ];

        this.symbolList = [
            '@', '#', '$', '%', '&', '*', '-', '+', '(', ')',
            '~', '`', '"', '\'', ':', ';', '_', '=', '\\', '/',
            '{', '}', '[', ']', '<', '>', '^', '|', '!', '?',
            'ABC', '@', ' ', ',', '.', '3'
        ];

        this.letterKeyboard = new ViewerModule();
        this.symbolKeyboard = new ViewerModule();

        for (let i = 0; i < this.letterList.length - 1; i++) {
            const key = new TextComponent(this.getOptions(this.letterList[i]));

            this.initKeyEvents(key);
            key.uiObject.position.z += 0.01;
            this.lettersKeyList.push(key);
            this.letterKeyboard.addObject(key);
        }

        for (let i = 0; i < this.symbolList.length - 1; i++) {
            const key = new TextComponent(this.getOptions(this.symbolList[i]));

            this.initKeyEvents(key);
            key.uiObject.position.z += 0.01;
            this.symbolKeyList.push(key);
            this.symbolKeyboard.addObject(key);
        }

        ObjectsPositioning.adjustObjects(this.lettersKeyList.map(a => a.uiObject), true, 0.1, 16);
        ObjectsPositioning.adjustObjects(this.symbolKeyList.map(a => a.uiObject), true, 0.1, 16);

        this.lettersKeyList.forEach(key => {
            if (key.options.text.value === ' ') key.uiObject.position.y -= 0.17;
        });

        this.symbolKeyboard.uiObject.visible = false;

        this.letterKeyboard.addObject(new WindowComponent({
            size: new Vector2(16.8, 7),
            background: 0x36454c,
            bordRadius: 0.3
        }));
        this.symbolKeyboard.addObject(new WindowComponent({
            size: new Vector2(16.8, 7),
            background: 0x36454c,
            bordRadius: 0.3
        }));
        this.addObject(this.letterKeyboard);
        this.addObject(this.symbolKeyboard);
    }

    private initNumberKeyboard() {
        this.numberList = [
            '1', '2', '3',
            '4', '5', '6',
            '7', '8', '9',
            '.', '0', '-', '3'
        ];

        this.numberKeyboard = new ViewerModule();

        for (let i = 0; i < this.numberList.length - 1; i++) {
            const key = new TextComponent(this.getOptions(this.numberList[i]));

            this.initKeyEvents(key);
            key.uiObject.position.z += 0.01;
            this.numberKeyList.push(key);
            this.numberKeyboard.addObject(key);
        }

        ObjectsPositioning.adjustObjects(this.numberKeyList.map(a => a.uiObject), true, 0.1, 5.2);

        this.numberKeyboard.addObject(new WindowComponent({
            size: new Vector2(6, 7),
            background: 0x36454c,
            bordRadius: 0.3
        }));
        this.numberKeyboard.uiObject.position.set(-12, 0, 0.65);
        this.numberKeyboard.uiObject.rotateY(0.2);
        this.addObject(this.numberKeyboard);
    }

    private initRightKeyboard() {
        this.rightKeyboard = new ViewerModule();

        this.rightList = [
            '',
            '',
            '',
            '3',
        ];

        for (let i = 0; i < this.rightList.length - 1; i++) {
            const key = new TextComponent(this.getOptions(this.rightList[i]));

            if (this.rightList[i] === '') {
                key.uiObject.rotateZ(-Math.PI / 2);
            }

            this.initKeyEvents(key);
            key.uiObject.position.z += 0.01;
            this.rightKeyList.push(key);
            this.rightKeyboard.addObject(key);
        }

        ObjectsPositioning.adjustObjects(this.rightKeyList.map(a => a.uiObject), true, 0.1, 3);

        this.rightKeyboard.addObject(new WindowComponent({
            size: new Vector2(5, 7),
            background: 0x36454c,
            bordRadius: 0.3
        }));
        this.rightKeyboard.uiObject.position.set(11.5, 0, 0.6);
        this.rightKeyboard.uiObject.rotateY(-0.2);
        this.addObject(this.rightKeyboard);
    }

    // type: default, over, down
    private getOptions(keyLetter: string, type: string = 'default'): ITextComponentOptions {
        let bgColor = '#36454c';
        // if (type === 'over') bgColor = '#46555c';
        if (type === 'over') bgColor = '#46555c';
        if (type === 'down') bgColor = '#66757c';

        const options: ITextComponentOptions = {
            background: {color: bgColor},
            size: this.getKeySize(keyLetter),
            pxSize: new Vector2(64, 64),
            text: {
                value: keyLetter,
                align: 'center',
                style: {
                    size: (keyLetter === '#+=' || keyLetter === 'ABC') ? '21px' : '27px',
                    color: '#eeeeee',
                    family: (keyLetter === '' || keyLetter === '' || keyLetter === '' || keyLetter === '' || keyLetter === '') ? 'FontAwesome' : 'Arial',
                    weight: (keyLetter === '' || keyLetter === '' || keyLetter === '' || keyLetter === '' || keyLetter === '') ? '900' : '400'
                },
                autoWrappingHorizontal: this.options.type === InputType.Custom,
                autoWrapping: false,
                lineHeight: 36,
            },
        };

        return options;
    }

    private getKeySize(keyLetter: string): Vector2 {
        let keySize = new Vector2(1.5, 1.4);

        if (keyLetter === '') keySize.set(0.1, 1.5);
        if (keyLetter === ' ') keySize.set(8, 1.1);
        if (keyLetter === '') keySize.set(2, 2);
        if (keyLetter === '') keySize.set(2, 2);
        if (keyLetter === '') keySize.set(2, 2);

        return keySize;
    }

    private initKeyEvents(key: TextComponent) {
        this.actionController.on(ActionControllerEventName.over, key.mesh, () => {
            if (key.options.text.value === '') return;
            key.uiObject.scale.set(1.2, 1.2, 1.2);

            // key.updateElement(this.getOptions(key.options.text.value, 'over'));
        });

        this.actionController.on(ActionControllerEventName.out, key.mesh, () => {
            if (key.options.text.value === '') return;
            key.uiObject.scale.set(1, 1, 1);

            // key.updateElement(this.getOptions(key.options.text.value, 'default'));
        });

        this.actionController.on(ActionControllerEventName.buttonDown, key.mesh, () => {
            if (key.options.text.value === '') return;
            key.uiObject.scale.set(1.5, 1.5, 1.5);

            // key.updateElement(this.getOptions(key.options.text.value, 'down'));
        });

        this.actionController.on(ActionControllerEventName.buttonUp, key.mesh, () => {
            if (key.options.text.value === '') return;
            key.uiObject.scale.set(1, 1, 1);

            // key.updateElement(this.getOptions(key.options.text.value, 'default'));
        });

        this.actionController.on(ActionControllerEventName.click, key.mesh,
            (event: ActionControllerEvent) => key.options.text.value !== '' && event.data.intersection.orderNumber === 0,
            (event: ActionControllerEvent) => {

                let allowType = true;

                if (key.options.text.value === '' || key.options.text.value === '') {
                    allowType = false;

                    key.setText(key.options.text.value === '' ? '' : '');

                    this.lettersKeyList.forEach(key => {
                        if (key.options.text.value.toUpperCase() === key.options.text.value) key.setText(key.options.text.value.toLowerCase());
                        else key.setText(key.options.text.value.toUpperCase());

                        key.update();
                    });
                } else if (key.options.text.value === '#+=' || key.options.text.value === 'ABC') {
                    this.letterKeyboard.uiObject.visible = !this.letterKeyboard.uiObject.visible;
                    this.symbolKeyboard.uiObject.visible = !this.symbolKeyboard.uiObject.visible;

                    allowType = false;
                } else if (key.options.text.value === '') {
                    this.fire(KeyboardEvents.onDelete);

                    allowType = false;
                } else if (key.options.text.value === '') {
                    this.fire(KeyboardEvents.onSubmit);

                    allowType = false;
                } else if (key.options.text.value === '') {
                    this.show(false);
                    this.fire(KeyboardEvents.onUnFocus);

                    allowType = false;
                }


                if (allowType) {
                    this.fire(KeyboardEvents.onEnterSymbol, new ParentEvent<KeyboardEvents>(KeyboardEvents.onEnterSymbol, {
                        key: key.options.text.value
                    }));
                }
            });
    }
}