import {Loader} from '../Loader';
import {Object3D} from 'three';
import {OBJLoader2} from 'three/examples/jsm/loaders/OBJLoader2';
import {disposeObject3D} from './utils';

export const OBJ2_MODEL = 'obj2Model';

export default class OBJModelsLoader2 extends Loader<Object3D> {
    public readonly loaderType: string = OBJ2_MODEL;

    constructor() {
        super();
    }

    protected disposeResource(resource: Object3D) {
        disposeObject3D(resource);
    }

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new OBJLoader2();
            loader.setCrossOrigin(crossOrigin || this.defaultCrossOrigin);
            loader.load(url, (obj2) => {
                this.library.set(name, obj2);
                resolve(obj2);
            }, () => {
            }, (error) => reject(error));
        });
    }
}
