import {GMesh, ViewerModule} from '@g.frame/core';
import {Color, DoubleSide, Float32BufferAttribute, MathUtils, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Texture, Vector2} from 'three';
import {ActionController} from '@g.frame/common.action_controller';

export interface ISegmentOptions {
    color?: Color;
    map?: Texture;
    innerRadius: number;
    outerRadius: number;
    innerAngle: number;
    outerAngle: number;
    startAngle: number;
    outerStartAngle: number;
    segmentsQuantity?: number;
}

export interface ITorusComponentOptions {
    diameter: number;
    width: number;
    color: Color | Texture;
    borderColor?: Color;
    innerBorderWidth?: number;
    outerBorderWidth?: number;
    sideBorderWidth?: number;
    arc?: number;
}

export class TorusComponent extends ViewerModule {
    private borderTorus: GMesh<ShapeGeometry, MeshBasicMaterial>;
    private backgroundTorus: GMesh<ShapeGeometry, MeshBasicMaterial>;

    /**
     * Constructor of TorusComponent
     * @param options ITorusComponentOptions
     * @param actionController ActionController
     */
    constructor(public options: ITorusComponentOptions, private actionController: ActionController) {
        super();
        this.update();
    }

    public static getSegment({color, map, innerRadius, outerRadius, innerAngle, outerAngle, startAngle, outerStartAngle, segmentsQuantity}: ISegmentOptions): GMesh<ShapeGeometry, MeshBasicMaterial> {
        const shape = new Shape();
        color = color || new Color(0xffffff);
        segmentsQuantity = segmentsQuantity || 72;
        startAngle = startAngle || 0;

        // OUTER CIRCLE
        const circleOuterPointList = [];
        for (let i = 0; i <= segmentsQuantity; i++) {
            const x = outerRadius * Math.cos(outerStartAngle + (i * (outerAngle / segmentsQuantity)));
            const y = outerRadius * Math.sin(outerStartAngle + (i * (outerAngle / segmentsQuantity)));
            circleOuterPointList.push(new Vector2(x, y));
        }


        // INNER CIRCLE
        const circleInnerPointList = [];

        for (let i = 0; i <= segmentsQuantity; i++) {
            const x = innerRadius * Math.cos(startAngle + (i * (innerAngle / segmentsQuantity)));
            const y = innerRadius * Math.sin(startAngle + (i * (innerAngle / segmentsQuantity)));
            circleInnerPointList.push(new Vector2(x, y));
        }


        shape.moveTo(circleInnerPointList[0].x, circleInnerPointList[0].y);

        circleInnerPointList.reverse();

        circleOuterPointList.forEach(point => shape.lineTo(point.x, point.y));
        circleInnerPointList.forEach(point => shape.lineTo(point.x, point.y));

        const geometry = new ShapeGeometry(shape);
        // geometry.faceVertexUvs[0].forEach(vec2Array => vec2Array.forEach(vec2 => {
        //     vec2.x /= outerRadius * 2;
        //     vec2.y /= outerRadius * 2;
        //     vec2.x += 0.5;
        //     vec2.y += 0.5;
        // }));

        // const uv = geometry.getAttribute('uv');

        // const newUV = (<Float32Array>uv.array).map((value, index) => {
        //     return (value / (outerRadius * 2)) + 0.5;
        // });

        // (<Float32BufferAttribute>uv).set(newUV);

        // uv.needsUpdate = true;

        const uvAttribute = geometry.getAttribute('uv');
        for (let i = 0; i < uvAttribute.count; i++) {
            let u = uvAttribute.getX(i);
            let v = uvAttribute.getY(i);

            u = u / outerRadius * 2 + 0.5;
            v = v / outerRadius * 2 + 0.5;

            uvAttribute.setXY(i, u, v);
        }

        uvAttribute.needsUpdate = true;

        return new GMesh<ShapeGeometry, MeshBasicMaterial>(
            geometry,
            new MeshBasicMaterial({color: color, map: map, side: DoubleSide})
        );
    }

    /**
     * Functions that updates geometry. It will dispose old objects.
     */
    update() {
        if (this.borderTorus) {
            this.disposeObject(this.borderTorus);
            this.borderTorus = null;
        }
        if (this.backgroundTorus) {
            this.disposeObject(this.backgroundTorus);
            this.backgroundTorus = null;
        }

        this.validateOptions();


        this.addObject(
            this.backgroundTorus = TorusComponent.getSegment({
                innerAngle: this.options.arc,
                outerAngle: this.options.arc,
                innerRadius: this.options.diameter / 2 - this.options.width / 2,
                outerRadius: this.options.diameter / 2 + this.options.width / 2,
                startAngle: 0,
                outerStartAngle: 0,
                color: this.options.color instanceof Color ? this.options.color : new Color(0xffffff),
                map: this.options.color instanceof Texture ? this.options.color : null
            }));

        const hasBorder = this.options.innerBorderWidth + this.options.outerBorderWidth > 0;
        if (hasBorder) {
            const borderTorusWidth = this.options.width + this.options.innerBorderWidth + this.options.outerBorderWidth;
            const bordersDifference = this.options.innerBorderWidth - this.options.outerBorderWidth;
            this.addObject(this.borderTorus = TorusComponent.getSegment({
                innerAngle: this.options.arc + 2 * this.options.sideBorderWidth / (this.options.diameter / 2 - this.options.width / 2 - this.options.innerBorderWidth),
                outerAngle: this.options.arc + 2 * this.options.sideBorderWidth / (this.options.diameter / 2 + this.options.width / 2 + this.options.outerBorderWidth),
                innerRadius: this.options.diameter / 2 - this.options.width / 2 - this.options.innerBorderWidth,
                outerRadius: this.options.diameter / 2 + this.options.width / 2 + this.options.outerBorderWidth,
                startAngle: -this.options.sideBorderWidth / (this.options.diameter / 2 - this.options.width / 2 - this.options.innerBorderWidth),
                outerStartAngle: -this.options.sideBorderWidth / (this.options.diameter / 2 + this.options.width / 2 + this.options.outerBorderWidth),
                color: this.options.borderColor instanceof Color ? this.options.borderColor : new Color(0xffffff),
            }));

            // this.addObject(this.borderTorus = new GMesh<TorusGeometry, MeshBasicMaterial>(new TorusGeometry(this.options.diameter / 2 - bordersDifference, borderTorusWidth, 2, 36, this.options.arc + 4 * this.options.sideBorderWidth / (this.options.diameter / 2 - bordersDifference)), new MeshBasicMaterial({color: this.options.borderColor})));
            // this.borderTorus.rotateZ(-2 * this.options.sideBorderWidth / (this.options.diameter / 2 - bordersDifference));
            this.backgroundTorus.position.z = 0.01;

        } else {
            this.backgroundTorus.position.z = 0;
        }
    }

    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }

    /**
     * Validation function
     */
    private validateOptions() {
        this.options.diameter = this.options.diameter || 1;
        this.options.width = this.options.width || 0.2;

        this.options.innerBorderWidth = [null, undefined].includes(this.options.innerBorderWidth) ? 0 : this.options.innerBorderWidth;
        this.options.outerBorderWidth = [null, undefined].includes(this.options.outerBorderWidth) ? 0 : this.options.outerBorderWidth;
        this.options.sideBorderWidth = [null, undefined].includes(this.options.sideBorderWidth) ? 0 : this.options.sideBorderWidth;

        this.options.arc = [null, undefined].includes(this.options.arc) ? 2 * Math.PI : this.options.arc;
        this.options.arc = MathUtils.clamp(this.options.arc, 0, 2 * Math.PI);
    }

}