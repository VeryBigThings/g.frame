import {Loader} from '../Loader';
import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader';
import {Object3D} from 'three';
import {disposeObject3D} from './utils';

export const DAE_MODEL = 'daeModel';

export default class DAEModelsLoader extends Loader<Object3D> {
    public readonly loaderType: string = DAE_MODEL;

    constructor() {
        super();
    }

    protected disposeResource(resource: Object3D) {
        disposeObject3D(resource);
    }

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new ColladaLoader();
            loader.setCrossOrigin(crossOrigin || this.defaultCrossOrigin);
            loader.load(url, (collada) => {
                this.library.set(name, collada.scene);
                resolve(collada.scene);
            }, () => {
            }, (error) => reject(error));
        });
    }
}