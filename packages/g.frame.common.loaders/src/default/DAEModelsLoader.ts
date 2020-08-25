import {Loader} from '../Loader';
import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader';
import {Object3D} from 'three';
export const DAE_MODEL = 'daeModel';

export default class DAEModelsLoader extends Loader<Object3D> {
    public readonly loaderType: string = DAE_MODEL;

    constructor() {
        super();
    }

    protected resourceToPromise(url: string, name: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new ColladaLoader();
            loader.setCrossOrigin('use-credentials');
            loader.load(url, (collada) => {
                this.library.set(name, collada.scene);
                resolve(collada.scene);
            }, () => {
            }, (error) => reject(error));
        });
    }
}