/**
 * @typeParam T is the class that Loader will return on .getResource
 * @param loaderType string is used for getting this type of Loader later on from the ResourcesManagerClass, and adding new ResourceRaw
 */

export class RenderAgent {
    constructor(private viewers: Array<any>) {

    }

    /**
     * @param type string - key for the loaders Map
     * @returns loader according to provided type
     */

    getViewer(type: string) {
        // const loader = this.loaders.filter(loader => loader.loaderType === type)[0];
        // if (!loader) {
        //     console.warn('no Loaders found with ' + type + ' type');
        // }

        // return loader;
    }

    update() {
        
    }

    dispose() {
        // this.loaders.forEach(loader => loader.dispose());
    }
}


// Loader.prototype.__agentConstructor = LoaderAgent;