import {EventDispatcher} from '../core/EventDispatcher';
import {Loader} from './Loader';

/** this Interface is used for creating new Resources and mark loaded
 * @param name string should be unique for every Loader, used to get a resource from the loader
 * @param url string is path or url for the resource file. FILE EXTENSION SHOULD SUPPORTED BY THE LOADER.
 * @param loaded boolean refers for the loading state. Once loaded (true) resource can be got
 * @param type string refers to Loader purposes (can be audio|model|font| or any custom)
 */

export interface ResourceRaw {
    name: string;
    url: string | Array<string>;
    loaded?: boolean;
    type: string;
}

/** ResourcesManager is used to upload audio|model|font| or any custom
 * @param loaders Map contains various Loaders. Use loader type for the map key
 */

export enum ResourcesManagerEventNames {
    loaded = 'loaded'
}

export class ResourcesManager extends EventDispatcher<ResourcesManagerEventNames> {
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

    load() {
        return Promise.all(Array.from(this.loaders.values()).map(loader => loader.load())).then(() => {
            this.fire(ResourcesManagerEventNames.loaded);
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