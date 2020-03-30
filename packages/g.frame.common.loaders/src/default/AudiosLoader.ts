import {Loader} from '../Loader';

export default class AudiosLoader extends Loader<HTMLAudioElement> {
    public readonly loaderType: string = 'audio';

    constructor() {
        super();
    }

    protected resourceToPromise(url: string, name: string): Promise<HTMLAudioElement> {

        return new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.load();
            audio.addEventListener('canplaythrough', () => resolve(), false);
            audio.addEventListener('error', () => reject(), false);

            this.library.set(name, audio);
        });
    }
}