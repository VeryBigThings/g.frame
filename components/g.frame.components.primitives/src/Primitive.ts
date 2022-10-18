import {
    BoxGeometry,
    BufferGeometry,
    CircleGeometry,
    Color,
    CylinderGeometry,
    Material,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    PlaneGeometry,
    SphereGeometry,
    Texture,
    TorusGeometry
} from 'three';
import {GMesh, GframeModule} from '@g.frame/core';
import {PrimitiveMaterials, PrimitiveType} from './Primitive_interfaces';

type PrimitivesGeometryType = BoxGeometry | CircleGeometry | CylinderGeometry | PlaneGeometry | SphereGeometry | TorusGeometry;

export class Primitive extends GframeModule {
    public mesh: GMesh<BufferGeometry, Material>;
    private _size: Array<Number>;
    private _materialType: PrimitiveMaterials;
    private _color: Color | string | number;
    private _opacity: number;
    private _wireframe: boolean;
    private _map: Texture;
    private _type: PrimitiveType;

    constructor(private type: PrimitiveType) {
        super();
        this._type = type;
    }

    size(...args: Array<number>) {
        this._size = args;
    }

    material(materialType: PrimitiveMaterials) {
        this._materialType = materialType;
    }

    color(color: Color | string | number) {
        this._color = color;
    }

    opacity(opacity: number) {
        this._opacity = opacity;
    }

    map(map: Texture) {
        this._map = map;
    }

    wireframe(wireframe: boolean = true) {
        this._wireframe = wireframe;
    }

    build() {
        this._size = this._size ?? [];
        this._materialType = this._materialType ?? PrimitiveMaterials.BASIC;
        this._color = this._color ?? Math.random() * 0xffffff;
        this._opacity = this._opacity ?? 1;
        this._wireframe = this._wireframe ?? false;
        this._map = this._map ?? null;

        if (!this._size.length) this._size = this._getDefaultSize();


        this.mesh = new GMesh<PrimitivesGeometryType, Material>(
            new (this._getGeometryConstructor())(...this._size),
            new (this._getMaterialConstructor())({
                color: this._color,
                opacity: this._opacity,
                transparent: this._opacity < 1,
                wireframe: this._wireframe,
                map: this._map
            }));
    }

    private _getGeometryConstructor(): new (...args: any[]) => PrimitivesGeometryType {
        switch (this._type) {
            case PrimitiveType.BOX:
                return BoxGeometry;
            case PrimitiveType.CIRCLE:
                return CircleGeometry;
            case PrimitiveType.CYLINDER:
                return CylinderGeometry;
            case PrimitiveType.PLANE:
                return PlaneGeometry;
            case PrimitiveType.SPHERE:
                return SphereGeometry;
            case PrimitiveType.TORUS:
                return TorusGeometry;
        }
    }

    private _getMaterialConstructor(): new (...args: any[]) => Material {
        switch (this._materialType) {
            case PrimitiveMaterials.BASIC:
                return MeshBasicMaterial;
            case PrimitiveMaterials.LAMBERT:
                return MeshLambertMaterial;
            case PrimitiveMaterials.PHONG:
                return MeshPhongMaterial;
            case PrimitiveMaterials.PHYSIC:
                return MeshPhysicalMaterial;
            case PrimitiveMaterials.STANDARD:
                return MeshStandardMaterial;
        }
    }

    private _getDefaultSize() {
        switch (this._type) {
            case PrimitiveType.BOX:
                return [1, 1, 1];
            case PrimitiveType.CIRCLE:
                return [0.5];
            case PrimitiveType.CYLINDER:
                return [0.5, 0.5, 1];
            case PrimitiveType.PLANE:
                return [1, 1];
            case PrimitiveType.SPHERE:
                return [0.5];
            case PrimitiveType.TORUS:
                return [0.5, 0.05];
        }
    }
}
