import {AudioListener, AudioLoader, Object3D, PositionalAudio, Texture, TextureLoader, warn} from 'three';

import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {EventDispatcher} from '../EventDispatcher';

enum FontFaceLoadStatus { unloaded, loading, loaded, error }

export interface IFontFace {
    family: 'string';
    style: 'string';
    weight: 'string';
    stretch: 'string';
    unicodeRange: 'string';
    variant: 'string';
    featureSettings: 'string';
    variationSettings: 'string';
    display: 'string';

    load: () => Promise<IFontFace>;
    readonly status: FontFaceLoadStatus;
    readonly loaded: Promise<IFontFace>;
}

declare function FontFace(name: string, url: string, config: { style: string; weight: number }): void;

interface ResourceRaw {
    name: string;
    url: string | Array<string>;
    loaded?: boolean;
    type: string;
}

export default class ResourcesManagerClass extends EventDispatcher {
    protected loaders: Map<string, Loader<any>>;

    constructor() {
        super();
    }

    addLoader(loader: Loader): boolean {
        if (this.loaders.get(loader.loaderType)) {
            warn('this type of Loader is already added');
            return false;
        } else {
            this.loaders.set(loader.loaderType, loader);
            return true;
        }
    }

    loadAll() {
        new Promise.all(Array.from(this.loaders.values()).map(loader => loader.load())).then(() => {
            this.fire('loaded');
            return true;
        }, () => {
            return false;
        });
    };

    addLoadResources(newResources: Array<ResourceRaw>) {
        let everyResourceAdded = true;
        newResources.forEach((resource) => {
            const loader = this.getLoader(resource.type);
            if (loader) {
                loader.addRaw(resource);
            } else {
                everyResourceAdded = false;
            }
        });
        return everyResourceAdded;
    }

    getLoader(type: string): Loader<any> {
        const loader = this.loaders.get(type);
        if (!loader) {
            warn('no Loaders found with this type');
        }

        return loader;
    }

}

const ResourcesManager = new ResourcesManagerClass();

export {ResourcesManager};


export class Loader<T> extends EventDispatcher {
    public loaderType: string;
    protected library: Map<string, T> = new Map<string, T>();
    protected resourcesRaw: Array<ResourceRaw> = [];

    constructor(loaderType: string) {
        super();
        this.loaderType = loaderType;
    }

    public addRaw(resource: ResourceRaw): boolean {
        if (resource.type === this.loaderType && resource.name.length && resource.url.length) {
            this.resourcesRaw.push(resource);
            return true;
        }
        return false;
    }

    load(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const notLoadedResources = this.resourcesRaw.filter(a => !a.loaded);
            if (notLoadedResources.length === 0) return resolve();
            Promise.all(notLoadedResources.map(textureRaw => this.resourceToPromise(<string>textureRaw.url, textureRaw.name))).then(() => resolve(), () => reject());
        });
    };

    getResource(name: string): T {
        const res = this.library.get(name);
        if (!res) {
            warn('no Resource found with this name');
        }

        return res;
    };

    setResource(name: string, resource: T) {
        this.library.set(name, resource);
    };

    protected resourceToPromise(url: string, name: string): Promise<T> {
        return;
    };

}


export class TexturesLoader extends Loader {

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

export class ModelsLoader extends Loader {

    constructor() {
        super('model');
    }

    protected resourceToPromise(url: string, name: string): Promise<Object3D> {

        return new Promise((resolve, reject) => {
            const loader = new FBXLoader();
            loader.load(url, (object) => {
                this.library.set(name, object);
                resolve(object);
            }, () => {
            }, (error) => reject(error));
        });
    }
}

export class FontsLoader extends Loader {
    private readonly nameExp: RegExp;

    constructor() {
        super('font');
        this.nameExp = new RegExp('^(.+)&(.+)-(.+)-(.+)$');
    }

    protected resourceToPromise(url: string, name: string): Promise<IFontFace> {
        return new Promise((resolve, reject) => {
            const fontParams = name.match(this.nameExp);
            if (fontParams) {
                const fontName = fontParams[1];
                const fontWeight = +fontParams[3];
                const fontStyle = fontParams[4];

                const loader = new FontFace(fontName, `url(${url})`, {style: fontStyle, weight: fontWeight});

                loader.load().then((loaded_face) => {
                    this.library.set(name, loaded_face);
                    (<any>document).fonts.add(loaded_face);
                    resolve(loaded_face);
                }).catch(function (error) {
                    reject(error);
                });
            } else {
                reject('incorrect font name');
            }
        });
    }
}

//
// export class HDRCubeTexturesLoader extends Loader {
//
//     constructor() {
//         super('HDR');
//     }
//
//
//     public loadAll(): Promise<void> {
//         return new Promise((resolve, reject) => {
//             this.on('all_loaded', resolve);
//             this.load();
//         });
//     }
//
//     public muteAll(group?: string) {
//         for (let i in this.library) if (this.library[i].group === [group] || this.library[i]) this.library[i].muted = true;
//     }
//
//     public unMuteAll(group?: string) {
//         for (let i in this.library) if (this.library[i].group === [group] || this.library[i]) this.library[i].muted = false;
//     }
//
//     protected resourceToPromise(url: string, name: string): Promise<Texture> {
//
//         return new Promise((resolve, reject) => {
//             const pmremGenerator = new PMREMGenerator(Viewer.renderer);
//             pmremGenerator.compileCubemapShader();
//             new HDRCubeTextureLoader()
//                 .setPath('./')
//                 .setDataType(UnsignedByteType)
//                 .load(url, (hdrCubeMap) => {
//                     const hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);
//                     hdrCubeMap.needsUpdate = true;
//                     pmremGenerator.dispose();
//
//                     this.library.set(name, hdrCubeRenderTarget.texture);
//                     resolve(hdrCubeRenderTarget.texture);
//
//                 }, null, (event) => reject(event));
//
//         });
//     }
// }

export class LocalAudioLoader extends Loader {

    constructor() {
        super('audio');
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

export class PositionalAudioLoader extends Loader {

    private queue: Array<PositionalAudio>;
    private audioLoader: AudioLoader;
    private audioListener: AudioListener;


    /**
     * Constructor of PositionalAudioLoader
     */
    constructor() {
        super('positional_audio');

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

export class VideoLoader extends Loader {

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
