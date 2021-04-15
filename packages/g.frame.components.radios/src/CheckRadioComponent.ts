import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import {ObjectsPositioning, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D, Vector2} from 'three';
import {ITextComponentOptions, TextComponent} from '@verybigthings/g.frame.components.text';

export interface ICheckRadioComponentOptions extends ITextComponentOptions {
    isCheckbox: boolean;
}

export class CheckRadioComponent extends ViewerModule {
    public readonly isCheckbox: boolean;
    private readonly icon: TextComponent;
    private readonly text: TextComponent;

    constructor(private options: ICheckRadioComponentOptions, private actionController: ActionController) {
        super();

        this._checked = false;
        this.isCheckbox = this.options.isCheckbox;

        this.text = new TextComponent(this.options);

        this.icon = new TextComponent({
            size: new Vector2(1.7, 1.7),
            pxSize: new Vector2(64, 64),
            background: {color: 'transparent'},
            text: {
                value: this.options.isCheckbox ? '' : '',
                style: {color: 'black', weight: '400', size: '26px', family: 'FontAwesome'},
                align: 'left',
                lineHeight: 20,
                autoWrappingHorizontal: true,
            }
        });

        this.addObject(this.icon);
        this.addObject(this.text);


        ObjectsPositioning.adjustObjects([this.icon.mesh, this.text.mesh], true, .1);

        this.initEvents();
    }

    private _checked: boolean;

    get checked(): boolean {
        return this._checked;
    }

    set checked(checked: boolean) {
        if (this.isCheckbox) {
            this.icon.setText(checked ? '' : '');
            this._checked = checked;
        } else {
            if (this._checked !== checked && checked) {
                this._checked = checked;
                this.icon.setText(checked ? '' : '');
            }
        }

        this.icon.update();

        if (this._checked === checked) this.fire('changed', new ParentEvent<string>('changed', this));
    }

    private _disabled: boolean;

    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(disabled: boolean) {
        this._disabled = disabled;
    }

    setUnchecked() {
        let isChanged = false;

        if (this.isCheckbox) {
            this.icon.setText('');
            isChanged = true;
        } else {
            if (this._checked) {
                this.icon.setText('');
                isChanged = true;
            }
        }

        this.icon.update();
        this._checked = false;

        if (isChanged) this.fire('changed', new ParentEvent<string>('changed', this));
    }

    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }

    private initEvents() {
        this.actionController.on(ActionControllerEventName.click, this.icon.uiObject, (event) => {
            if (event.orderNumber !== 0 || this._disabled) return;
            this.checked = !this._checked;
        });
        this.actionController.on(ActionControllerEventName.click, this.text.uiObject, (event) => {
            if (event.orderNumber !== 0 || this._disabled) return;
            this.checked = !this._checked;
        });
    }

}
