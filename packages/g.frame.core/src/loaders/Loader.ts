import {EventDispatcher} from '../core/EventDispatcher';
import {ResourceRaw} from './ResourcesManager';

/**
 * @typeParam T is the class that Loader will return on .getResource
 * @param loaderType string is used for getting this type of Loader later on from the ResourcesManagerClass, and adding new ResourceRaw
 */

export class Loader<T> extends EventDispatcher<string> {
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
            Promise.all(notLoadedResources.map(resourceRaw => this.resourceToPromise(<string>resourceRaw.url, resourceRaw.name))).then(() => resolve(), () => reject());
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