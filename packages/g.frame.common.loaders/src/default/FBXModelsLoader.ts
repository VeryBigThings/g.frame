import {Loader} from '../Loader';
import {Object3D} from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
export const FBX_MODEL = 'fbxModel';

export default class FBXModelsLoader extends Loader<Object3D> {
    public readonly loaderType: string = FBX_MODEL;

    constructor() {
        super();
    }

    protected resourceToPromise(url: string, name: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new FBXLoader();
            loader.load(url, (object) => {
                this.library.set(name, object);
                resolve(object);
            }, () => {
            }, (error) => reject(error));
        });
    }
}