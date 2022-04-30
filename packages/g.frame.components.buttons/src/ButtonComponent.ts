import {CircleGeometry, Color, Group, Mesh, MeshBasicMaterial, Object3D, Vector2, Vector3} from 'three';
import {ITextViewerModuleOptions, TextViewerModule} from '@g.frame/components.text';
import {ButtonComponentType, IButtonComponentOptions} from './ButtonComponent_interfaces';
import {RoundedPlane, ViewerModule} from '@g.frame/core';
import {ActionController, ActionControllerEvent, ActionControllerEventName} from '@g.frame/common.action_controller';

export class ButtonComponent extends TextViewerModule {
    protected box: Mesh;
    protected group: Group;

    constructor(private options: IButtonComponentOptions, private actionController: ActionController) {
        super(options.sizePx || new Vector2(64, 64), new Vector2(Math.sqrt(2 * Math.pow(options.size.x / 2, 2)), Math.sqrt(2 * Math.pow(options.size.y / 2, 2))));
        if (options.type === ButtonComponentType.default) {
            options.background = options.background || {};
            options.background.color = options.background.color || (options.boxColor ? new Color(options.boxColor).getStyle() : '#fff');
            options.text.autoWrappingHorizontal = true;
            options.text.lineHeight = options.text.lineHeight || 44;
            options.bordRadius = options.bordRadius !== null && options.bordRadius !== undefined ? options.bordRadius : 0.6;
            options.text.align = 'center';
        } else if (options.type === ButtonComponentType.volumetric) {
            options.background = options.background || {};
            options.background.color = options.background.color || (options.boxColor ? new Color(options.boxColor).getStyle() : '#fff');
            options.text.autoWrappingHorizontal = true;
            options.text.lineHeight = options.text.lineHeight || 44;
            options.text.align = 'center';
        } else if (options.type === ButtonComponentType.icon) {
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


    updateElement(options: ITextViewerModuleOptions): Mesh {
        const temp = super.updateElement(options);

        if (this.options.type === ButtonComponentType.volumetric) {
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

        } else if (this.options.type === ButtonComponentType.icon) {
            this.mesh.geometry.dispose();
            // @ts-ignore
            this.mesh.geometry = new CircleGeometry(this.options.size.x / 2, 36);


        } else if (this.options.type === ButtonComponentType.default) {
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
    }

    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }
}
