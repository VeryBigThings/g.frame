import {Color, Group, Mesh, MeshStandardMaterial, Object3D, PlaneGeometry, Vector2} from 'three';
import {ButtonComponent} from '@verybigthings/g.frame.components.buttons';
import {WindowComponent} from '@verybigthings/g.frame.components.window';
import {ParentEvent, GComponent} from '@verybigthings/g.frame.core';
import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';

declare function require(s: string): string;


export enum SliderComponentSlidingMode {
    normal = 'normal',
    onlyToRight = 'onlyToRight',
    onlyToLeft = 'onlyToLeft'
}

export interface ISliderComponentOptions {
    mode?: SliderComponentSlidingMode;
    magnetOnSides?: number;
    size: {
        width: number;
        height: number;
    };

    filledPart: {
        border?: number;
        radius?: number;
        borderColor?: Color;
        mainColor?: Color;
    };

    unfilledPart: {
        border?: number;
        radius?: number;
        borderColor?: Color;
        mainColor?: Color;
    };

    picker: ButtonComponent;


}

export class SliderComponent extends GComponent {
    private mode: SliderComponentSlidingMode;
    private magnetOnSides: number;
    private mainContainer: Group;
    private visualGroup: Group;
    private dragGroup: Group;
    private slider: ButtonComponent;
    private width: number;
    private height: number;
    private slideActive: boolean = false;
    private background: WindowComponent;
    private filledPart: WindowComponent;
    private applyBtn: ButtonComponent;

    constructor(private options: ISliderComponentOptions, private actionController: ActionController) {
        super();
        this.mode = options.mode || SliderComponentSlidingMode.normal;
        this.magnetOnSides = options.magnetOnSides || 0;
        this.options = options;

        this.mainContainer = new Group();
        this.mainContainer.name = 'Main Container';

        this.width = options.size ? options.size.width : 2;
        this.height = options.size ? options.size.height : 0.2;

        this.addObject(this.mainContainer);

        this.init();
    }

    private _value: number;

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
        this.updateFilledPart();
    }

    init() {
        this.visualGroup = new Group();
        this.visualGroup.name = 'Visual Group';
        this.mainContainer.add(this.visualGroup);

        this.createDrag();
        this.createBackground();
        this.createFilledPart();
        this.updateFilledPart();
    }

    createBackground() {
        this.background = new WindowComponent({
            size: new Vector2(this.width - this.options.unfilledPart.border, this.height - this.options.unfilledPart.border),
            bordRadius: this.options.unfilledPart.radius,
            bordWidth: this.options.unfilledPart.border,
            bordColor: this.options.unfilledPart.borderColor.getHex(),
            background: this.options.unfilledPart.mainColor.getHex(),
        });
        this.addObject(this.background);
    }

    createFilledPart() {
        this.filledPart = new WindowComponent({
            size: new Vector2((this.width - this.options.filledPart.border) * this._value, this.height - this.options.filledPart.border),
            bordRadius: this.options.filledPart.radius,
            bordWidth: this.options.filledPart.border,
            bordColor: this.options.filledPart.borderColor.getHex(),
            background: this.options.filledPart.mainColor.getHex(),
        });
        this.addObject(this.filledPart);
    }

    updateFilledPart() {
        this.filledPart.setSize(new Vector2((this.width - this.options.filledPart.border) * this._value, this.height - this.options.filledPart.border));
        this.filledPart.uiObject.position.set((this.mode === SliderComponentSlidingMode.onlyToRight || this.mode === SliderComponentSlidingMode.normal ? -1 : 1) * 0.5 * (this.width - ((this.width - this.options.filledPart.border) * this._value)), 0, 0.02);
    }


    createDrag() {
        this.dragGroup = new Group();
        this.dragGroup.name = 'Drag Group';
        this.mainContainer.add(this.dragGroup);

        // const sliderStart = -(this.width - sliderWidth) / 2;
        const sliderStart = (this.mode === SliderComponentSlidingMode.normal || this.mode === SliderComponentSlidingMode.onlyToRight) ? -this.width / 2 : this.width / 2;
        this.slider = this.options.picker;
        // this.slider = new IconButtonComponent();
        this.slider.uiObject.position.set(sliderStart, 0, 0);
        this.addObject(this.slider);
        this.slider.uiObject.parent.remove(this.slider.uiObject);
        this.dragGroup.add(this.slider.uiObject);

        // const sliderPlaneWidth = this.width - sliderWidth;

        const slidePlane = new Mesh(new PlaneGeometry(this.width * 2, this.height * 5), new MeshStandardMaterial({
            color: '#333333',
            side: 2,
            visible: false
        }));
        this.dragGroup.add(slidePlane);
        slidePlane.visible = false;

        this.actionController.on(ActionControllerEventName.buttonDown, this.slider.uiObject, () => {
            this.slideActive = true;
            this.fire('slideStart');
            // this.controls.enabled = false;
            slidePlane.visible = true;
        });

        this.actionController.on(ActionControllerEventName.buttonUp, null, () => {
            this.slideActive = false;
            this.fire('slideEnd');
            // this.controls.enabled = true;
            slidePlane.visible = false;
        });

        this.actionController.on(ActionControllerEventName.move, slidePlane, (event) => {
            if (this.slideActive) {
                const point = event.data.intersection.point;
                this.moveEvent(this.uiObject.worldToLocal(point));
            }
        });

        this.on('completed', () => {
            this.slideActive = false;
            // this.controls.enabled = true;
            slidePlane.visible = false;
        });
    }

    moveEvent(point) {
        let x;
        switch (this.mode) {
            case SliderComponentSlidingMode.normal:
                x = point.x;
                break;
            case SliderComponentSlidingMode.onlyToLeft:
                if (this.slider.uiObject.position.x > point.x) x = point.x;
                else x = this.slider.uiObject.position.x;
                break;
            case SliderComponentSlidingMode.onlyToRight:
                if (this.slider.uiObject.position.x < point.x) x = point.x;
                else x = this.slider.uiObject.position.x;
                break;
        }
        const alphaBeforeMagnet = (x + this.width / 2) / this.width;
        if (this.magnetOnSides && (this.mode === SliderComponentSlidingMode.normal || this.mode === SliderComponentSlidingMode.onlyToLeft)) {
            if (alphaBeforeMagnet < this.magnetOnSides) {
                x = -this.width / 2;
            }
        }
        if (this.magnetOnSides && (this.mode === SliderComponentSlidingMode.normal || this.mode === SliderComponentSlidingMode.onlyToRight)) {
            if ((1 - alphaBeforeMagnet) < this.magnetOnSides) {
                x = this.width / 2;
            }
        }
        if (x !== undefined) {
            this.slider.uiObject.position.x = x;
            this.slider.uiObject.position.z = 0.02;
            let alpha = (x + this.width / 2) / this.width;
            if (this.mode === SliderComponentSlidingMode.onlyToLeft) alpha = 1 - alpha;
            this.value = alpha;
            this.fire('change', new ParentEvent<string>('change', alpha));
            if (alpha === 1) {

                this.fire('completed');
            }
        }

    }

    disposeObject(object?: Object3D | GComponent, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }
}