import {EventDispatcher} from '../core/EventDispatcher';


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
        this.loaders = new Map<string, Loader<any>>();
    }

    addLoader(loader: Loader<any>): boolean {
        if (this.loaders.get(loader.loaderType)) {
            console.warn('this type of Loader is already added');
            return false;
        } else {
            this.loaders.set(loader.loaderType, loader);
            return true;
        }
    }

    loadAll() {
        return Promise.all(Array.from(this.loaders.values()).map(loader => loader.load())).then(() => {
            this.fire('loaded');
            return true;
        }, () => {
            return false;
        });
    }

    addLoadResources(newResources: Array<ResourceRaw>) {
        let everyResourceAdded = true;
        newResources.forEach((resource) => {
            const loader = this.getLoader(resource.type);
            if (loader) {
                if (!loader.addRaw(resource)) {
                    everyResourceAdded = false;
                }
            } else {
                everyResourceAdded = false;
            }
        });
        return everyResourceAdded;
    }

    getLoader(type: string): Loader<any> {
        const loader = this.loaders.get(type);
        if (!loader) {
            console.warn('no Loaders found with ' + type + ' type');
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

    addRaw(resource: ResourceRaw): boolean {
        if (resource.type === this.loaderType && resource.name.length && resource.url.length) {
            this.resourcesRaw.push(resource);
            if (this.resourcesRaw.find(el => el.name === resource.name)) {
                console.warn('a resource with name ' + resource.name + ' was found in the ' + this.loaderType + ' Loader library. It be replaced with new one, once loaded');
            }
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
    }

    getResource(name: string): T {
        const res = this.library.get(name);
        if (!res) {
            console.warn('no Resource found with this name');
        }

        return res;
    }

    setResource(name: string, resource: T) {
        this.library.set(name, resource);
    }

    protected resourceToPromise(url: string, name: string): Promise<T> {
        return;
    }

}