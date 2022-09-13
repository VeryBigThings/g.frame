import {Loader} from '../Loader';

export const AUDIO = 'audio';


export default class AudiosLoader extends Loader<HTMLAudioElement> {
    public readonly loaderType: string = AUDIO;

    constructor() {
        super();
    }

    protected disposeResource(resource: HTMLAudioElement) {
        resource.pause();
        resource.removeAttribute('src'); // empty source
        resource.load();
        resource.remove();
    }

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<HTMLAudioElement> {

        return new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.crossOrigin = crossOrigin || this.defaultCrossOrigin;
            audio.load();
            audio.addEventListener('canplaythrough', () => resolve(audio), false);
            audio.addEventListener('error', () => reject(), false);

            this.library.set(name, audio);
        });
    }
}