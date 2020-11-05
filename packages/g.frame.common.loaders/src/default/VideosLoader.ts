import {Loader} from '../Loader';

export const VIDEO = 'video';

export default class VideosLoader extends Loader<HTMLVideoElement> {

    public readonly loaderType: string = 'video';

    constructor() {
        super();
    }

    protected disposeResource(resource: HTMLVideoElement) {
        resource.pause();
        resource.removeAttribute('src'); // empty source
        resource.load();
        resource.remove();
    }

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<HTMLVideoElement> {

        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.crossOrigin = crossOrigin || this.defaultCrossOrigin;
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
