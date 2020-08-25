import {Loader} from '../Loader';
import {Object3D} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
export const GLTF_MODEL = 'gltfModel';

export default class GLTFModelsLoader extends Loader<Object3D> {
    public readonly loaderType: string = GLTF_MODEL;

    constructor() {
        super();
    }

    protected resourceToPromise(url: string, name: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.setCrossOrigin('use-credentials');
            loader.load(url, (gltf) => {
                this.library.set(name, gltf.scene);
                resolve(gltf.scene);
            }, () => {
            }, (error) => reject(error));
        });
    }
}
