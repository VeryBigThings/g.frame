import {Texture, TextureLoader} from 'three';
import {Loader} from '../Loader';

export const TEXTURE = 'texture';


export default class TexturesLoader extends Loader<Texture> {
    public readonly loaderType: string = TEXTURE;

    constructor() {
        super();
    }

    protected resourceToPromise(url: string, name: string): Promise<Texture> {

        return new Promise((resolve, reject) => {
            const loader = new TextureLoader();
            loader.setCrossOrigin('use-credentials');

            const onLoad = (texture) => {
                resolve(texture);
            };

            const onError = (event) => reject(event);

            this.library.set(name, loader.load(url, onLoad, undefined, onError));
        });
    }

}