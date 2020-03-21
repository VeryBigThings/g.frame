import {Texture, TextureLoader} from 'three';
import {Loader} from '../Loader';

export default class TexturesLoader extends Loader<Texture> {

    constructor() {
        super('texture');
    }

    protected resourceToPromise(url: string, name: string): Promise<Texture> {

        return new Promise((resolve, reject) => {

            const onLoad = (texture) => {
                resolve(texture);
            };

            const onError = (event) => reject(event);

            this.library.set(name, new TextureLoader().load(url, onLoad, undefined, onError));
        });
    }

}