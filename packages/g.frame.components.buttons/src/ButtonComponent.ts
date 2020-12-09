import {CircleGeometry, Color, DoubleSide, Group, Mesh, MeshBasicMaterial, Object3D, Vector2, Vector3} from 'three';
import {ITextGComponentOptions, TextGComponent} from '@verybigthings/g.frame.components.text';
import {IButtonComponentOptions} from './ButtonComponent_interfaces';
// import * as TWEEN from '../libs/TWEEN/Tween';
import {RoundedPlane, GComponent} from '@verybigthings/g.frame.core';
import {
    ActionController,
    ActionControllerEvent,
    ActionControllerEventName
} from '@verybigthings/g.frame.common.action_controller';
import {WindowComponent} from '@verybigthings/g.frame.components.window';

export class ButtonComponent extends TextGComponent {
    protected box: Mesh;
    protected group: Group;

    constructor(private options: IButtonComponentOptions, private actionController: ActionController) {
        super(options.sizePx || new Vector2(64, 64), new Vector2(Math.sqrt(2 * Math.pow(options.size.x / 2, 2)), Math.sqrt(2 * Math.pow(options.size.y / 2, 2))));
        if (options.type === 'flat') {
            options.background = options.background || {};
            options.background.color = options.background.color || (options.boxColor ? new Color(options.boxColor).getStyle() : '#fff');
            options.text.autoWrappingHorizontal = true;
            options.text.lineHeight = options.text.lineHeight || 44;
            options.bordRadius = options.bordRadius !== null && options.bordRadius !== undefined ? options.bordRadius : 0.6;
            options.text.align = 'center';
        } else if (options.type === '3d') {
            options.background = options.background || {};
            options.background.color = options.background.color || (options.boxColor ? new Color(options.boxColor).getStyle() : '#fff');
            options.text.autoWrappingHorizontal = true;
            options.text.lineHeight = options.text.lineHeight || 44;
            options.text.align = 'center';
        } else if (options.type === '3dEmpty') {
            options.background = options.background || {};
            options.background.color = options.background.color || (options.boxColor ? new Color(options.boxColor).getStyle() : '#fff');
            options.text.autoWrappingHorizontal = true;
            options.text.lineHeight = options.text.lineHeight || 44;
            options.text.align = 'center';
            options.bordRadius = options.bordRadius !== null && options.bordRadius !== undefined ? options.bordRadius : 0.6;
        } else if (options.type === 'icon') {
            options.background = options.background || {};
            options.background.color = options.background.color || (options.boxColor ? new Color(options.boxColor).getStyle() : '#fff');
            options.text.autoWrappingHorizontal = false;
            options.text.align = 'center';
            options.text.lineHeight = options.text.lineHeight || 44;
            options.text.style = options.text.style || {
                color: options.text.style.color || 'red',
                weight: options.text.style.weight || '900',
                size: options.text.style.size || '46px',
                family: options.text.style.family || 'FontAwesome'
            };
            options.text.align = 'center';
        } else if (options.type === '3dIconEmpty') {
            options.background = options.background || {};
            options.background.color = options.background.color || (options.boxColor ? new Color(options.boxColor).getStyle() : '#fff');
            options.bordRadius = options.bordRadius !== null && options.bordRadius !== undefined ? options.bordRadius : 0.1;
            options.text.autoWrappingHorizontal = true;
            options.text.autoWrapping = true;
            options.text.align = 'center';
            options.text.lineHeight = options.text.lineHeight || 44;
            options.text.style = options.text.style || {
                color: 'black',
                weight: '900',
                size: '46px',
                family: 'FontAwesome'
            };

        }
        options.background.radius = options.bordRadius;
        this.options = options;
        this.updateElement(this.options);

        this.actionController.on(ActionControllerEventName.click, this.mesh, (event: ActionControllerEvent) => {
            if (event.data.intersection.orderNumber === 0) {
                this.fire('click');
            }
        });
    }

    public setText(text: string) {
        this.options.text.value = text;
        this.updateElement(this.options);
    }


    updateElement(options: ITextGComponentOptions): Mesh {
        const temp = super.updateElement(options);

        if (this.options.type === '3d') {
            if (this.box) {
                this.actionController.off(null, this.box);
                this.box.parent.remove(this.box);
                this.box.geometry.dispose();
                (<MeshBasicMaterial>this.box.material).dispose();
            }
            this.mesh.geometry.computeBoundingBox();
            const size = this.mesh.geometry.boundingBox.getSize(new Vector3());

            const roundedBoxOptions = {
                width: size.x,
                height: size.y,
                depth: this.options.size.z,
                color: this.options.boxColor,
                r1: this.options.bordRadius,
            };

            this.box = RoundedPlane.getRoundedBox(roundedBoxOptions);
            this.box.position.z = this.options.size.z / 1.7;
            this.mesh.position.z += this.options.size.z + 0.01 + this.box.position.z;
            this.addObject(this.box);

            this.actionController.on(ActionControllerEventName.buttonDown, this.box, () => this.clickButtonFunc(true));
            this.actionController.on(ActionControllerEventName.buttonUp, this.box, () => this.clickButtonFunc(false));
            this.actionController.on(ActionControllerEventName.click, this.box, (event: ActionControllerEvent) => event.data.intersection.orderNumber === 0 && this.fire('click'));

        } else if (this.options.type === '3dEmpty') {
            if (this.box) {
                this.actionController.off(null, this.box);
                this.box.parent.remove(this.box);
                this.box.geometry.dispose();
                (<MeshBasicMaterial>this.box.material).dispose();
            }
            this.mesh.geometry.computeBoundingBox();
            const size = this.mesh.geometry.boundingBox.getSize(new Vector3());

            const background = new Color(options.background.color).getHex();
            const planeFront = new WindowComponent({
                size: new Vector2(size.x, size.y),
                background,
                bordRadius: this.options.bordRadius,
                bordWidth: 0.06
            });
            const planeBack = new WindowComponent({
                size: new Vector2(size.x, size.y),
                bordRadius: this.options.bordRadius,
                bordWidth: 0.06
            });
            planeFront.uiObject.position.z += size.z ? size.z : 1.7;
            planeBack.uiObject.position.z += size.z ? size.z : 0.05;
            this.mesh.position.z += size.z ? size.z : 1.71;
            this.addObject(planeFront.uiObject);
            this.addObject(planeBack.uiObject);

            this.actionController.on(ActionControllerEventName.buttonDown, planeFront.uiObject, () => this.clickButtonFunc(true));
            this.actionController.on(ActionControllerEventName.buttonDown, planeBack.uiObject, () => this.clickButtonFunc(true));
            this.actionController.on(ActionControllerEventName.buttonUp, planeFront.uiObject, () => this.clickButtonFunc(false));
            this.actionController.on(ActionControllerEventName.buttonUp, planeBack.uiObject, () => this.clickButtonFunc(false));
            this.actionController.on(ActionControllerEventName.click, planeBack.uiObject, (event: ActionControllerEvent) => event.data.intersection.orderNumber === 0 && this.fire('click'));
            this.actionController.on(ActionControllerEventName.click, planeFront.uiObject, (event: ActionControllerEvent) => event.data.intersection.orderNumber === 0 && this.fire('click'));
        } else if (this.options.type === '3dIconEmpty') {
            if (this.box) {
                this.actionController.off(null, this.box);
                this.box.parent.remove(this.box);
                this.box.geometry.dispose();
                (<MeshBasicMaterial>this.box.material).dispose();
            }
            this.mesh.geometry.computeBoundingBox();
            const color = new Color(options.background.color).getHex();
            const background = new Color(options.background.color).getHex();
            const planeFront1 = new Mesh(new CircleGeometry(this.options.size.x / 2, 36), new MeshBasicMaterial({
                color: 'black',
                side: DoubleSide
            }));
            planeFront1.position.set(0, 0, -0.05);
            const planeFront2 = new Mesh(new CircleGeometry(this.options.size.x / 2 - this.options.bordRadius, 36), new MeshBasicMaterial({
                color: color,
                side: DoubleSide
            }));
            const planeBack1 = new Mesh(new CircleGeometry(this.options.size.x / 2, 36), new MeshBasicMaterial({
                color: 'black',
                side: DoubleSide
            }));
            planeBack1.position.set(0, 0, -0.05);
            const planeBack2 = new Mesh(new CircleGeometry(this.options.size.x / 2 - this.options.bordRadius, 36), new MeshBasicMaterial({
                color: color,
                side: DoubleSide
            }));
            const planeFront = new Group();
            planeFront.add(planeFront1, planeFront2);
            const planeBack = new Group();
            planeBack.add(planeBack1, planeBack2);
            planeFront.position.z += 1.7;
            planeBack.position.z -= 0.05;
            this.mesh.position.z += 1.71;
            this.addObject(planeFront);
            this.addObject(planeBack);

            this.actionController.on(ActionControllerEventName.buttonDown, planeFront2, () => this.clickButtonFunc(true));
            this.actionController.on(ActionControllerEventName.buttonDown, planeBack2, () => this.clickButtonFunc(true));
            this.actionController.on(ActionControllerEventName.buttonUp, planeFront2, () => this.clickButtonFunc(false));
            this.actionController.on(ActionControllerEventName.buttonUp, planeBack2, () => this.clickButtonFunc(false));
            this.actionController.on(ActionControllerEventName.click, planeFront2, (event: ActionControllerEvent) => event.data.intersection.orderNumber === 0 && this.fire('click'));
            this.actionController.on(ActionControllerEventName.click, planeBack2, (event: ActionControllerEvent) => event.data.intersection.orderNumber === 0 && this.fire('click'));
        } else if (this.options.type === 'icon') {
            this.mesh.geometry.dispose();
            // @ts-ignore
            this.mesh.geometry = new CircleGeometry(this.options.size.x / 2, 36);


        } else if (this.options.type === 'flat') {
            this.mesh.geometry.dispose();
            if (this.box) {
                this.actionController.off(null, this.box);
                this.box.parent.remove(this.box);
                this.box.geometry.dispose();
                (<MeshBasicMaterial>this.box.material).dispose();
            }
            this.mesh.geometry.computeBoundingBox();
            // @ts-ignore
            const size = this.mesh.geometry.boundingBox.getSize(new Vector3());

            const roundedPlaneOptions = {
                width: size.x,
                height: size.y,
                color: new Color(this.options.background.color).getHex(),
                r1: this.options.bordRadius,
            };

            this.box = RoundedPlane.getRoundedPlane(roundedPlaneOptions);
            this.box.position.z += 0.005;
            this.addObject(this.box);
        }
        this.mesh.position.z = 0.02;

        return temp;
    }

    clickButtonFunc(buttonDown: boolean = true) {
        const endScaleZ = buttonDown ? 0.5 : 1;
        this.uiObject.scale.set(1, 1, endScaleZ);
        // new TWEEN.Tween(this.uiObject.scale)
        //     .to(new Vector3(1, 1, endScaleZ), 100)
        //     .easing(TWEEN.Easing.Linear.None)
        //     .start();
    }

    disposeObject(object?: Object3D | GComponent, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }
}
