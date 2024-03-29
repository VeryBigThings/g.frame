import {Texture, TextureLoader} from 'three';
import {Loader} from '../Loader';

export const TEXTURE = 'texture';


export default class TexturesLoader extends Loader<Texture> {
    public readonly loaderType: string = TEXTURE;

    constructor() {
        super();
    }


    protected disposeResource(resource: Texture) {
        resource.dispose();
    }

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<Texture> {

        return new Promise((resolve, reject) => {
            const loader = new TextureLoader();
            loader.setCrossOrigin(crossOrigin || this.defaultCrossOrigin);

            const onLoad = (texture) => {
                resolve(texture);
            };

            const onError = (event) => reject(event);

            this.library.set(name, loader.load(url, onLoad, undefined, onError));
        });
    }

}