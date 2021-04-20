import {Color, Group, Mesh, MeshStandardMaterial, Object3D, PlaneGeometry, Vector2, Vector3} from 'three';
import {ButtonComponent} from '@g.frame/components.buttons';
import {ParentEvent, ViewerModule} from '@g.frame/core';
import {TorusComponent} from './TorusComponent';
import {TextComponent} from '@g.frame/components.text';
import {ActionController, ActionControllerEventName} from '@g.frame/common.action_controller';

declare function require(s: string): string;


export enum CircleSliderComponentSlidingMode {
    normal = 'normal',
    onlyClockwise = 'onlyClockwise',
    onlyAntiClockwise = 'onlyAntiClockwise'
}

export interface ICircleSliderComponentOptions {
    diameter: number;
    picker: ButtonComponent;

    mode?: CircleSliderComponentSlidingMode;
    magnetOnSides?: number;
    spaceBetweenObjects?: number;

    filledPart: {
        width: number;
        border?: number;
        borderColor?: Color;
        mainColor?: Color;
        arc?: number;
    };

    unfilledPart: {
        width: number;
        border?: number;
        borderColor?: Color;
        mainColor?: Color;
        arc?: number;
    };


}

export class CircleSliderComponent extends ViewerModule {
    private mainContainer: Group;
    private visualGroup: Group;
    private dragGroup: Group;
    private slider: ButtonComponent;
    private slideActive: boolean = false;
    private background: TorusComponent;
    private filledPart: TorusComponent;

    private minAngle: number;
    private maxAngle: number;

    private debugMode: boolean = false;
    private debugText: TextComponent;

    constructor(private options: ICircleSliderComponentOptions, private actionController: ActionController) {
        super();
        options.mode = options.mode || CircleSliderComponentSlidingMode.onlyClockwise;
        options.magnetOnSides = options.magnetOnSides || 0;
        options.spaceBetweenObjects = options.spaceBetweenObjects || 0.02;

        options.filledPart.arc = options.filledPart.arc || Math.PI * 2;
        options.filledPart.mainColor = options.filledPart.mainColor || new Color(0xffffff);
        options.filledPart.borderColor = options.filledPart.borderColor || new Color(0x000000);
        options.filledPart.border = options.filledPart.border || 0;
        options.filledPart.arc = options.filledPart.arc || Math.PI * 2;


        options.unfilledPart.arc = options.unfilledPart.arc || Math.PI * 2;
        options.unfilledPart.mainColor = options.unfilledPart.mainColor || new Color(0xaaaaaa);
        options.unfilledPart.borderColor = options.unfilledPart.borderColor || new Color(0x222222);
        options.unfilledPart.border = options.unfilledPart.border || 0;
        options.unfilledPart.arc = options.unfilledPart.arc || Math.PI * 2;

        this.mainContainer = new Group();
        this.mainContainer.name = 'Main Container';

        // this.uiObject.visible = false;

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

        this.createBackground();
        this.createFilledPart();
        this.updateFilledPart();
        this.createDrag();

        if (this.debugMode) this.updateDebugInfo();
    }

    updateDebugInfo(angle?: number) {
        if (!this.debugText) {
            this.addObject(this.debugText = new TextComponent({
                size: new Vector2(0.3, 0.3),
                pxSize: new Vector2(72, 72),
                text: {
                    value: '',
                    autoWrappingHorizontal: true,
                    autoWrapping: true,

                }
            }));
        }
        this.debugText.setText(`${this.minAngle.toFixed(3)}; ${angle !== undefined ? angle.toFixed(2) : ''} ; ${this.maxAngle.toFixed(3)};`);
    }

    createBackground() {
        this.background = new TorusComponent({
            diameter: this.options.diameter,
            width: this.options.unfilledPart.width,
            sideBorderWidth: this.options.unfilledPart.border,
            outerBorderWidth: this.options.unfilledPart.border,
            innerBorderWidth: this.options.unfilledPart.border,
            borderColor: this.options.unfilledPart.borderColor,
            color: this.options.unfilledPart.mainColor,
            arc: this.options.unfilledPart.arc
        }, this.actionController);
        this.addObject(this.background);
    }

    createFilledPart() {
        this.filledPart = new TorusComponent({
            diameter: this.options.diameter,
            width: this.options.filledPart.width,
            sideBorderWidth: this.options.filledPart.border,
            outerBorderWidth: this.options.filledPart.border,
            innerBorderWidth: this.options.filledPart.border,
            borderColor: this.options.filledPart.borderColor,
            color: this.options.filledPart.mainColor,
            arc: this.options.filledPart.arc,
        }, this.actionController);
        this.addObject(this.filledPart);
        this.minAngle = (this.options.unfilledPart.arc - this.options.filledPart.arc) / 2;
        this.maxAngle = this.minAngle + this.options.filledPart.arc;

        this.filledPart.uiObject.rotateZ(this.minAngle);
    }

    updateFilledPart() {
        this.filledPart.options.arc = this._value * this.options.filledPart.arc;
        this.filledPart.uiObject.position.z = this.options.spaceBetweenObjects;
        if (this.options.mode === CircleSliderComponentSlidingMode.onlyClockwise) this.filledPart.uiObject.rotation.z = this.maxAngle - this._value * this.options.filledPart.arc;
        this.filledPart.update();
    }


    createDrag() {
        this.dragGroup = new Group();
        this.dragGroup.name = 'Drag Group';
        this.mainContainer.add(this.dragGroup);

        // const sliderStart = -(this.width - sliderWidth) / 2;
        this.slider = this.options.picker;
        // this.slider = new IconButtonComponent();
        this.slider.uiObject.position.copy(this.angleToPoint(this.options.mode === CircleSliderComponentSlidingMode.onlyClockwise ? this.maxAngle : this.minAngle)).setZ(2 * this.options.spaceBetweenObjects);
        this.slider.uiObject.rotation.z = this.options.mode === CircleSliderComponentSlidingMode.onlyClockwise ? this.maxAngle : this.minAngle;
        this.addObject(this.slider);
        this.slider.uiObject.parent.remove(this.slider.uiObject);
        this.dragGroup.add(this.slider.uiObject);

        // const sliderPlaneWidth = this.width - sliderWidth;

        const slidePlane = new Mesh(new PlaneGeometry(this.options.diameter * 2, this.options.diameter * 2), new MeshStandardMaterial({
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
                this.moveEvent(this.pointToAngle(this.uiObject.worldToLocal(point)));
            }
        });

        this.on('completed', () => {
            this.slideActive = false;
            // this.controls.enabled = true;
            slidePlane.visible = false;
        });
    }

    /**
     *
     * @param newAngle number New angle in radians
     */
    moveEvent(newAngle: number) {
        let angle;
        let sliderAngle = this.pointToAngle(this.slider.uiObject.position);
        if (this.options.mode === CircleSliderComponentSlidingMode.normal) {
            if (sliderAngle < 0) sliderAngle += 2 * Math.PI;
            if (newAngle < 0) newAngle += 2 * Math.PI;
        }
        if (Math.abs(Math.abs(newAngle) - Math.abs(sliderAngle)) < Math.PI / 3) {

            switch (this.options.mode) {

                case CircleSliderComponentSlidingMode.normal:
                    angle = newAngle;
                    break;
                case CircleSliderComponentSlidingMode.onlyAntiClockwise:
                    if (sliderAngle < newAngle) angle = newAngle;
                    else angle = sliderAngle;
                    break;
                case CircleSliderComponentSlidingMode.onlyClockwise:
                    if (sliderAngle > newAngle) angle = newAngle;
                    else angle = sliderAngle;
                    break;
            }
        }


        if (angle !== undefined) {
            angle = this.magnetize(angle);

            if (this.options.mode === CircleSliderComponentSlidingMode.onlyAntiClockwise)
                angle = Math.max(this.minAngle, Math.min(angle, this.maxAngle));
            else if (this.options.mode === CircleSliderComponentSlidingMode.onlyClockwise)
                angle = Math.min(this.minAngle, Math.max(angle, this.maxAngle - 4 * Math.PI));
            else if (this.options.mode === CircleSliderComponentSlidingMode.normal) {
                angle = Math.max(this.minAngle, Math.min(angle, this.maxAngle));
            }
            if (this.debugMode) this.updateDebugInfo(angle);
            this.slider.uiObject.position.copy(this.angleToPoint(angle)).setZ(2 * this.options.spaceBetweenObjects);
            this.slider.uiObject.rotation.z = angle;

            this.value = this.angleToValue(angle);
            this.fire('change', new ParentEvent<string>('change', this.value));
            if (this.value === 1) {
                this.fire('completed');
            }
        }

    }

    dispose(): void {
        super.dispose();
    }

    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }

    private angleToPoint(angle: number): Vector3 {
        let point = new Vector3();
        point.x = this.options.diameter * 0.5 * Math.cos(angle);
        point.y = this.options.diameter * 0.5 * Math.sin(angle);
        return point;
    }

    private pointToAngle(point: Vector3): number {
        let angle;
        const normalized = point.clone().setZ(0).normalize();

        angle = Math.atan2(normalized.y, normalized.x);

        if (this.options.mode === CircleSliderComponentSlidingMode.onlyAntiClockwise && angle < 0) {
            angle = 2 * Math.PI + angle;
        }

        if (this.options.mode === CircleSliderComponentSlidingMode.onlyClockwise && angle > 0) {
            angle = -2 * Math.PI + angle;
        }

        return angle;

    }

    private magnetize(_angle: number): number {
        let angle = _angle;
        const magnetValue = this.options.magnetOnSides; // current value between 0 and 1

        let currentValue = this.angleToValue(angle);
        if (currentValue + magnetValue > 1) currentValue = 1;
        angle = this.valueToAngle(currentValue);
        return angle;
    }

    private angleToValue(angle: number): number {
        const max = this.maxAngle;
        const min = this.minAngle;
        let currentValue;
        if (this.options.mode === CircleSliderComponentSlidingMode.onlyClockwise) {
            currentValue = (max - (angle + 2 * Math.PI)) / (max - min);
        } else if (this.options.mode === CircleSliderComponentSlidingMode.onlyAntiClockwise) {
            currentValue = (angle - min) / (max - min);
        } else if (this.options.mode === CircleSliderComponentSlidingMode.normal) {
            currentValue = (angle - min) / (max - min);
        }
        return currentValue;
    }

    private valueToAngle(value: number): number {
        const max = this.maxAngle;
        const min = this.minAngle;
        let angle;
        if (this.options.mode === CircleSliderComponentSlidingMode.onlyClockwise) {
            angle = max - (max - min) * value - 2 * Math.PI;
        } else if (this.options.mode === CircleSliderComponentSlidingMode.onlyAntiClockwise) {
            angle = min + (max - min) * value;
        } else if (this.options.mode === CircleSliderComponentSlidingMode.normal) {
            angle = min + (max - min) * value;
        }
        return angle;
    }
}