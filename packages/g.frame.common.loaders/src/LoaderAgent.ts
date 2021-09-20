import {Loader, LoaderEventsName} from './Loader';
import {ResourceRaw} from './interfaces';

/**
 * @typeParam T is the class that Loader will return on .getResource
 * @param loaderType string is used for getting this type of Loader later on from the ResourcesManagerClass, and adding new ResourceRaw
 */

export class LoaderAgent extends Loader<any> {
    constructor(private loaders: Array<Loader<any>>) {
        super();
    }

    /**
     * @param newResources ResourceRaw new items that will be added to library once .load() passes through
     * @returns boolean based on if the resource type is supported for the Loader, name and url exist. Defines if is it added to resourcesRaw Array
     */

    addResources(newResources: Array<ResourceRaw>): boolean {
        let everyResourceAdded = true;
        newResources.forEach((resource) => {
            const loader = this.getLoader(resource.type);
            if (loader) {
                if (!loader.addResources(resource)) {
                    everyResourceAdded = false;
                }
            } else {
                everyResourceAdded = false;
            }
        });
        return everyResourceAdded;
    }

    /**
     * @returns Promise that executes after all raw resources was loaded according to resourceToPromise
     */

    load(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Promise.all(
                this.loaders.map(loader => loader.load())
            ).then(
                () => {
                    resolve();
                    this.fire(LoaderEventsName.loaded);
                },
                () => {
                    reject();
                }
            );
        });
    }

    /** USE THIS FUNCTION TO GET READY RESOURCES
     * @param name string Resource name to get
     * @returns resource with the provided name, or undefined if none was found
     */

    getResource<T>(name: string): T {
        const resource = this.loaders.map(loader => loader.getResource(name, false)).filter(resource => !!resource)[0];
        if (!resource) {
            console.warn('no Resource found with this name', name);
        }

        return resource;
    }


    /**
     * @param type string - key for the loaders Map
     * @returns loader according to provided type
     */

    getLoader(type: string): Loader<any> {
        const loader = this.loaders.filter(loader => loader.loaderType === type)[0];
        if (!loader) {
            console.warn('no Loaders found with ' + type + ' type');
        }

        return loader;
    }

    dispose(recources: string[] = []) {
        this.loaders.forEach(loader => loader.dispose(recources));
    }
}


Loader.prototype.__agentConstructor = LoaderAgent;