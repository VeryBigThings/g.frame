import {EventDispatcher} from '../core/EventDispatcher';

/** this Interface is used for creating new Resources and mark loaded
 * @param name string should be unique for every Loader, used to get a resource from the loader
 * @param url string is path or url for the resource file. FILE EXTENSION SHOULD SUPPORTED BY THE LOADER.
 * @param loaded boolean refers for the loading state. Once loaded (true) resource can be got
 * @param type string refers to Loader purposes (can be audio|model|font| or any custom)
 */

interface ResourceRaw {
    name: string;
    url: string | Array<string>;
    loaded?: boolean;
    type: string;
}

/** ResourcesManagerClass or ResourcesManager is used to upload audio|model|font| or any custom
 * @param loaders Map contains various Loaders. Use loader type for the map key
 */

export default class ResourcesManagerClass extends EventDispatcher {
    protected loaders: Map<string, Loader<any>>;

    constructor() {
        super();
        this.loaders = new Map<string, Loader<any>>();
    }

    /**
     *
     * @param loader new loader, that extends Loader
     * @returns boolean depending on is it added to loaders or not
     */

    addLoader(loader: Loader<any>): boolean {
        if (this.loaders.get(loader.loaderType)) {
            console.warn('this type of Loader is already added');
            return false;
        } else {
            this.loaders.set(loader.loaderType, loader);
            return true;
        }
    }

    /**
     * @function loadAll calls .load() on every Loader in the loaders Map.
     * @returns boolean depending on load result (true - for loaded, false - for not loaded)
     * use once all needed Resources added to loaders library
     */

    loadAll() {
        return Promise.all(Array.from(this.loaders.values()).map(loader => loader.load())).then(() => {
            this.fire('loaded');
            return true;
        }, () => {
            return false;
        });
    }

    /**
     * @function addLoadResources adds new ResourcesRaw to Loaders in the loaders Map, depending on the type.
     * @returns everyResourceAdded boolean if true - all resources found it's Loader, false - at least one had no related type of Loader
     */

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


    /**
     * @param type string - key for the loaders Map
     * @returns loader according to provided type
     */

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

/**
 * @typeParam T is the class that Loader will return on .getResource
 * @param loaderType string is used for getting this type of Loader later on from the ResourcesManagerClass, and adding new ResourceRaw
 */

export class Loader<T> extends EventDispatcher {
    public loaderType: string;
    protected library: Map<string, T> = new Map<string, T>();
    protected resourcesRaw: Array<ResourceRaw> = [];

    constructor(loaderType: string) {
        super();
        this.loaderType = loaderType;
    }

    /**
     * @param resource ResourceRaw new items that will be added to library once .load() passes through
     * @returns boolean based on if the resource type is supported for the Loader, name and url exist. Defines if is it added to resourcesRaw Array
     */

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

    /**
     * @returns Promise that executes after all raw resources was loaded according to resourceToPromise
     */

    load(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const notLoadedResources = this.resourcesRaw.filter(a => !a.loaded);
            if (notLoadedResources.length === 0) return resolve();
            Promise.all(notLoadedResources.map(textureRaw => this.resourceToPromise(<string>textureRaw.url, textureRaw.name))).then(() => resolve(), () => reject());
        });
    }

    /** USE THIS FUNCTION TO GET READY RESOURCES
     * @param name string Resource name to get
     * @returns resource with the provided name, or undefined if none was found
     */

    getResource(name: string): T {
        const res = this.library.get(name);
        if (!res) {
            console.warn('no Resource found with this name');
        }

        return res;
    }

    /**
     * @param name string Resource name to set
     * @param resource to set to library of loaded resources
     * @returns resource with the provided name, or undefined if none was found
     */

    setResource(name: string, resource: T) {
        this.library.set(name, resource);
    }

    /** MODIFY THIS IN EXTENDED CLASS TO LOAD RESOURCES PROPERLY
     * You can look for ModelsLoader|AudiosLoader|FontsLoader and find an example there
     * @param url string path that leads to the file
     * @param name string resource name to set
     * @returns resource Promise with new resource
     */

    protected resourceToPromise(url: string, name: string): Promise<T> {
        return;
    }

}