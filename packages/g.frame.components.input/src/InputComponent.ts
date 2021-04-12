import {WindowComponent} from 'g.frame.components.window';
import {Box3, DoubleSide, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector2, Vector3} from 'three';
import {ITextComponentOptions, TextComponent} from 'g.frame.components.text';
import {IInputComponentOptions} from './interfaces';
import {
    ActionController,
    ActionControllerEvent,
    ActionControllerEventName
} from 'g.frame.common.action_controller';
import {ViewerModule} from 'g.frame.core';
import {Input, InputManager, InputType} from 'g.frame.input';

export class InputComponent extends WindowComponent implements Input {
    public inputString: string = '';
    public text: TextComponent;
    public options: IInputComponentOptions;
    private textTest: TextComponent;
    private maxInputWidth: number;
    private numbMaxVisibleLetters: number = 0;
    private cursor: Mesh;
    private blinkInterval: NodeJS.Timeout;

    constructor(options: IInputComponentOptions, private actionController: ActionController, public inputManager: InputManager) {
        super(options);

        if (this.options.maxLength === undefined) this.options.maxLength = 9999999;

        this.cursor = new Mesh(
            new PlaneGeometry(options.cursorWidth || 0.05, options.size.y / 1.3, 2),
            new MeshBasicMaterial({color: 0x333333, side: DoubleSide})
        );
        this.cursor.position.z += 0.08;
        this.cursor.visible = false;
        this.addObject(this.cursor);
        this.textTest = new TextComponent(this.getOptions(options.textComponent.text.value || '', options.size.multiplyScalar(0.97), options.pxSize));
        this.addObject(this.text = new TextComponent(this.getOptions(options.textComponent.text.value || '', options.size.multiplyScalar(0.97), options.pxSize)));
        this.maxInputWidth = options.size.x;

        const textSize = new Box3().setFromObject(this.text.uiObject).getSize(new Vector3());

        this.textTest.uiObject.position.x += -this.options.size.x / 2 + textSize.x / 2;
        this.textTest.uiObject.position.y += 5;
        this.textTest.uiObject.position.z = 0.01;

        this.updateTextPos();
        this.initEvents();

        if (this.options.maskFunction) {
            this.text.setText(this.options.maskFunction(this.inputString, ''));
            this.updateTextPos();
        }
    }

    public _isFocused: boolean = false;

    get isFocused(): boolean {
        return this._isFocused;
    }

    set isFocused(isFocused: boolean) {
        this._isFocused = isFocused;
        if (isFocused) this.enableBlink();
        else this.disableBlink();
    }

    getText(): string {
        return this.inputString;
    }

    addSymbol(symbol: string) {
        if (this.inputString.length >= this.options.maxLength && symbol !== '') return;

        const isNumber = symbol === '0' ? true : !!+symbol;
        const isOperator = !!['+', '.'].find(el => el === symbol);
        if (this.options.type === InputType.Letters) {
            if (isNumber) return;
        } else {
            if (this.options.type === InputType.Numbers) {
                if (!isNumber && !isOperator && symbol !== '') return;
            }
        }

        if (this.inputString.length !== 0 && this.options.type === InputType.Custom && symbol !== '') symbol = ' ' + symbol;
        this.inputString += symbol;

        if (!this.options.maskFunction) {
            this.calcTestTextPos(symbol);
            this.text.setText(this.inputString.substr(-this.numbMaxVisibleLetters));

        } else {
            this.text.setText(this.options.maskFunction(this.inputString, symbol));
        }

        this.updateTextPos();
    }

    removeLastSymbol() {
        if (this.options.type === InputType.Custom) {
            let lastIndexOf = (this.inputString.lastIndexOf(' ') > 0) ? this.inputString.lastIndexOf(' ') : 0;
            this.inputString = this.inputString.slice(0, lastIndexOf);
            this.addSymbol('');
        } else {
            this.inputString = this.inputString.slice(0, -1);
            this.addSymbol('');
        }
    }

    enter(): boolean {
        this.fire('entered');
        return true;
    }

    clear() {
        this.inputString = '';
        this.calcTestTextPos('');
        this.text.setText('');
        this.updateTextPos();
    }

    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }

    private initEvents() {
        this.actionController.on(ActionControllerEventName.click, this.uiObject,
            (event: ActionControllerEvent) => event.data.intersection.orderNumber === 0 && !this.isFocused,
            (event) => {
                this.isFocused = true;
                this.fire('onInputClicked');
                this.inputManager.currentInput = this;
            });
    }

    private enableBlink() {
        if (this.blinkInterval) return;
        this.cursor.visible = true;
        this.blinkInterval = setInterval(() => {
            this.cursor.visible = !this.cursor.visible;
        }, 800);
    }

    private disableBlink() {
        this.cursor.visible = false;
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;
    }

    private getOptions(symbol: string = '', size?: Vector2, pxSize?: Vector2): ITextComponentOptions {

        const options: ITextComponentOptions = {
            background:  this.options.textComponent.background || {
                color: '#FFF'
            },
            size: size ? size.clone() : this.text.options.size.clone(),
            pxSize: pxSize ? pxSize.clone() : this.text.options.pxSize.clone(),
            text: {
                value: symbol,
                align: this.options.textComponent.text.align || 'left',
                autoWrappingHorizontal: this.options.textComponent.text.autoWrappingHorizontal === undefined ? true : this.options.textComponent.text.autoWrappingHorizontal,
                autoWrapping: this.options.textComponent.text.autoWrapping === undefined ? false : this.options.textComponent.text.autoWrapping,
                style: this.options.textComponent.text.style || {size: '32px'},
                lineHeight: this.options.textComponent.text.lineHeight || 38
            },
        };

        return options;
    }

    private calcTestTextPos(symbol: string) {

        this.numbMaxVisibleLetters = 0;

        for (let i = this.inputString.length - 1; i >= 0; i--) {
            this.numbMaxVisibleLetters++;

            this.textTest.setText(this.inputString.substr(-this.numbMaxVisibleLetters));

            const b3 = new Box3();
            b3.setFromObject(this.textTest.uiObject);
            const textSize = new Vector3();
            b3.getSize(textSize);

            if (textSize.x >= this.maxInputWidth) {
                this.numbMaxVisibleLetters--;
                break;
            }
        }
    }

    private updateTextPos() {
        const b3 = new Box3();
        b3.setFromObject(this.text.uiObject);
        const textSize = b3.getSize(new Vector3());

        this.text.uiObject.position.x = -this.maxInputWidth / 2 + textSize.x / 2;
        this.text.uiObject.position.z = 0.01;

        this.text.uiObject.rotation.set(0, 0, 0);
        this.cursor.position.x = -this.maxInputWidth / 2 + textSize.x;
    }
}