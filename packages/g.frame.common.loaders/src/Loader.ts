import {EventDispatcher} from '@g.frame/core';
import {ResourceRaw} from './interfaces';

/**
 * @typeParam T is the class that Loader will return on .getResource
 * @param loaderType string is used for getting this type of Loader later on from the ResourcesManagerClass, and adding new ResourceRaw
 */

export enum LoaderEventsName {
    loaded = 'loaded'
}

export class Loader<T> extends EventDispatcher<LoaderEventsName> {
    public __agentConstructor: Function;
    public readonly loaderType: string;
    public defaultCrossOrigin: string = 'use-credentials';
    protected readonly library: Map<string, T> = new Map<string, T>();
    protected readonly resourcesRaw: Array<ResourceRaw> = [];

    constructor(_loaderType?: string) {
        super();
        this.loaderType = _loaderType ?? 'undefined_type';
    }

    private _progress: number = 0;

    get progress(): number {
        return this._progress;
    }

    private _maximumProgress: number = 0;

    get maximumProgress(): number {
        return this._maximumProgress;
    }

    /**
     * @param newResource ResourceRaw new items that will be added to library once .load() passes through
     * @returns boolean based on if the resource type is supported for the Loader, name and url exist. Defines if is it added to resourcesRaw Array
     */

    addResources(newResource: Array<ResourceRaw> | ResourceRaw): boolean {
        if (newResource instanceof Array) return false;
        if (newResource.type === this.loaderType && newResource.name.length && newResource.url.length) {
            if (this.resourcesRaw.find(el => el.name === newResource.name)) {
                console.warn('a resource with name ' + newResource.name + ' was found in the ' + this.loaderType + ' loader library. It won\'t be replaced with new one.');
            } else {
                this.resourcesRaw.push(newResource);
            }
            return true;
        }
        return false;
    }

    /**
     * @returns Promise that executes after all raw resources was loaded according to resourceToPromise
     */

    load(): Promise<void> {
        const notLoadedResources = this.resourcesRaw.filter(a => !a.loaded);
        this._maximumProgress = notLoadedResources.length;
        this._progress = 0;

        return new Promise<void>((resolve, reject) => {
            if (notLoadedResources.length === 0) {
                return resolve();
            }
            Promise.all(
                notLoadedResources
                    .map(resourceRaw =>
                        this.resourceToPromise(<string>resourceRaw.url, resourceRaw.name, resourceRaw.crossOrigin)
                            .then(() => this._progress++)
                    )
            ).then(() => {
                resolve();
                this.fire(LoaderEventsName.loaded);
            }, () => {
                reject();
            });
        });
    }

    /** USE THIS FUNCTION TO GET READY RESOURCES
     * @param name string Resource name to get
     * @param _throwWarning boolean
     * @returns resource with the provided name, or undefined if none was found
     */

    getResource<C extends T>(name: string, _throwWarning: boolean = true): C {
        const res = this.library.get(name);
        if (!res && _throwWarning) {
            console.warn('no Resource found with this name');
        }

        return <C>res;
    }

    dispose(resources: string[] = []) {
        this.off();

        if (resources.length) {
            resources.forEach(name => {
                if (this.library.get(name)) {
                    this.disposeResource(this.library.get(name));
                    this.library.set(name, null);
                }
            });
        } else {
            this.library.forEach((resource, name) => {
                this.disposeResource(resource);
                this.library.set(name, null);
            });
        }

    }

    protected disposeResource(resource: T) {}

    /**
     * @param name string Resource name to set
     * @param resource to set to library of loaded resources
     * @returns resource with the provided name, or undefined if none was found
     */

    protected setResource(name: string, resource: T) {
        this.library.set(name, resource);
    }

    /** MODIFY THIS IN EXTENDED CLASS TO LOAD RESOURCES PROPERLY
     * You can look for ModelsLoader|AudiosLoader|FontsLoader and find an example there
     * @param url string path that leads to the file
     * @param name string resource name to set
     * @param crossOrigin string crossOrigin setting for current resource
     * @returns resource Promise with new resource
     */

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<T> {
        return;
    }
}