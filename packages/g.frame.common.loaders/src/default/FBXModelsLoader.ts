import {Loader} from '../Loader';
import {Object3D} from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {disposeObject3D} from './utils';

export const FBX_MODEL = 'fbxModel';

export default class FBXModelsLoader extends Loader<Object3D> {
    public readonly loaderType: string = FBX_MODEL;

    constructor() {
        super();
    }

    protected disposeResource(resource: Object3D) {
        disposeObject3D(resource);
    }

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new FBXLoader();
            loader.setCrossOrigin(crossOrigin || this.defaultCrossOrigin);
            loader.load(url, (object) => {
                this.library.set(name, object);
                resolve(object);
            }, () => {
            }, (error) => reject(error));
        });
    }
}
