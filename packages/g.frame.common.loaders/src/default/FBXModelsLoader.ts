import {Loader} from '../Loader';
import {Object3D, LoadingManager} from 'three';
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
            const loadingManager = new LoadingManager();
            const loader = new FBXLoader(loadingManager);
            let _object;
            loader.setCrossOrigin(crossOrigin || this.defaultCrossOrigin);
            loader.load(url, (object) => {
                this.library.set(name, object);
                _object = object;
            }, () => {
            }, (error) => reject(error));
            loadingManager.onLoad = () => resolve(_object);
        });
    }
}
