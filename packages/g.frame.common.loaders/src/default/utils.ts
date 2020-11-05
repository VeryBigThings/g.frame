import {Material, Mesh, Object3D, Texture, WebGLRenderTarget} from 'three';

export function disposeObject3D(object3D: Object3D) {
    const disposeMaps = (material: any) => {
        for (const materialElement in material) {
            if (!material.hasOwnProperty(materialElement)) continue;
            if (material[materialElement] instanceof Texture
                || material[materialElement] instanceof WebGLRenderTarget) {
                material[materialElement].dispose();
            }
        }
    };
    object3D.traverse(obj => {
        if (!(obj instanceof Mesh)) return;
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material && obj.material instanceof Material) {
            obj.material.dispose();
            disposeMaps(obj.material);
        }
        if (obj.material && obj.material instanceof Array) obj.material.forEach(material => {
            material.dispose();
            disposeMaps(material);
        });

    });
}