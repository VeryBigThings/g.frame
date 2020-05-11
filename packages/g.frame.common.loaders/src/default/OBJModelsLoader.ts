import {Loader} from '../Loader';
import {Object3D} from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
export const OBJ_MODEL = 'objModel';

export default class OBJModelsLoader extends Loader<Object3D> {
    public readonly loaderType: string = OBJ_MODEL;

    constructor() {
        super();
    }

    protected resourceToPromise(url: string, name: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new OBJLoader();
            loader.load(url, (obj) => {
                this.library.set(name, obj);
                resolve(obj);
            }, () => {
            }, (error) => reject(error));
        });
    }
}
