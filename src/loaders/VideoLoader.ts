import {Loader} from './ResourcesManager';

export default class VideoLoader extends Loader<HTMLVideoElement> {

    constructor() {
        super('video');
    }

    protected resourceToPromise(url: string, name: string): Promise<HTMLVideoElement> {

        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.crossOrigin = 'anonymous';
            video.loop = false;
            video.autoplay = false;
            video.muted = false;
            video.addEventListener('canplaythrough', () => resolve(), false);
            video.addEventListener('error', () => reject(), false);
            video.src = url;
            this.library.set(name, video);
        });
    }
}
