import {BufferGeometry, Geometry, Material, Mesh} from 'three';

/**
 * Class GMesh is fully extended from Mesh, but has two generics for geometry and material.
 * How to use:
 *  Describing type of Mesh that has inside PlaneBufferGeometry and MeshBasicMaterial:
 *      ```
 *      private borderTorus: GMesh<PlaneBufferGeometry, MeshBasicMaterial>;
 *      ```
 *  Creating instance of Mesh, that has inside PlaneBufferGeometry and MeshBasicMaterial:
 *      ```
 *      this.borderTorus = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(new PlaneBufferGeometry(1, 1), new MeshBasicMaterial({}));
 *      ```
 */
export class GMesh<T extends Geometry | BufferGeometry, U extends Material | Material[]> extends Mesh {
    geometry: T;
    material: U;
}