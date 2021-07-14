import {RoundedPlane, ViewerModule} from '@g.frame/core';
import {Mesh, MeshBasicMaterial, Vector2} from 'three';
import {WindowComponentOptions} from './WindowComponent_interfaces';


export class WindowComponent extends ViewerModule {
    public name: string;
    public uiObject: Mesh;
    private uiObjectOuter: Mesh;
    private uiObjectInner: Mesh;

    constructor(protected options: WindowComponentOptions) {
        super();

        this.generate();
    }


    setSize(newSize: Vector2) {
        this.options.size.copy(newSize);
        this.generate();
    }

    private generate() {
        if (this.uiObjectInner) this.disposeObject(this.uiObjectInner);
        if (this.uiObjectOuter) this.disposeObject(this.uiObjectOuter);
        const borderAllow = this.options.bordWidth || this.options.bordColor;
        if (borderAllow) {
            this.options.bordColor = this.options.bordColor ? this.options.bordColor : 0x000000;
            this.options.bordWidth = this.options.bordWidth ? this.options.bordWidth : 0;
        }
        this.options.bordRadius = this.options.bordRadius ? this.options.bordRadius : 0;

        const outerSize = {
            x: this.options.size.x + this.options.bordWidth * 2,
            y: this.options.size.y + this.options.bordWidth * 2,
            bordRadius: this.options.bordRadius === 0 ? 0 : this.options.bordRadius + this.options.bordWidth,
        };

        const roundedPlaneOptions = {
            width: this.options.size.x,
            height: this.options.size.y,
            color: this.options.background || 0xffffff,
            r1: this.options.bordRadius,
        };

        this.uiObjectInner = RoundedPlane.getRoundedPlane(roundedPlaneOptions);
        (<MeshBasicMaterial>this.uiObjectInner.material).map = this.options.backgroundTexture || null;

        this.addObject(this.uiObjectInner);

        if (this.options.bordWidth > 0) {
            const roundedOuterPlaneOptions = {
                width: outerSize.x,
                height: outerSize.y,
                color: this.options.bordColor,
                r1: outerSize.bordRadius,
            };

            this.uiObjectOuter = RoundedPlane.getRoundedPlane(roundedOuterPlaneOptions);
            this.uiObjectOuter.position.z -= 0.01;
            this.addObject(this.uiObjectOuter);
        }
    }
}
