import {Object3D, ObjectLoader} from 'three';
import {Loader} from '../Loader';
import {disposeObject3D} from './utils';


export const JSON_MODEL = 'jsonModel';

export default class JSONModelsLoader extends Loader<Object3D> {
    public readonly loaderType: string = JSON_MODEL;

    constructor() {
        super();
    }

    protected disposeResource(resource: Object3D) {
        disposeObject3D(resource);
    }

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new ObjectLoader();
            loader.setCrossOrigin(crossOrigin || this.defaultCrossOrigin);
            loader.load(url, (object) => {
                this.library.set(name, object);
                resolve(object);
            }, () => {
            }, (error) => reject(error));
        });
    }
}
