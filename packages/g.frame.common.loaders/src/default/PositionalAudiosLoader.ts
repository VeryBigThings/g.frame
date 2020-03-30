import {Loader} from '../Loader';
import {AudioListener, AudioLoader, PositionalAudio} from 'three';

export default class PositionalAudiosLoader extends Loader<PositionalAudio> {

    public readonly loaderType: string = 'positional_audio';
    private readonly audioLoader: AudioLoader;
    private readonly audioListener: AudioListener;

    /**
     * Constructor of PositionalAudioLoader
     */
    constructor() {
        super();

        this.audioListener = new AudioListener();
        this.audioLoader = new AudioLoader();

    }

    public muteAll(group?: string) {
        this.audioListener.setMasterVolume(0);
    }

    public unMuteAll(group?: string) {
        this.audioListener.setMasterVolume(1);
    }

    protected resourceToPromise(url: string, name: string): Promise<PositionalAudio> {

        return new Promise((resolve, reject) => {
            this.audioLoader.load(url, (audioBuffer) => {
                const audio = new PositionalAudio(this.audioListener);
                audio.setBuffer(audioBuffer);
                audio.setRefDistance(20);
                this.setAudio(name, audio);
                resolve();
            }, null, (error) => {
                console.log(error);
                reject();
            });

        });
    }

    private setAudio(name: string, audio: PositionalAudio): void {
        this.library.set(name, audio);
    }
}
