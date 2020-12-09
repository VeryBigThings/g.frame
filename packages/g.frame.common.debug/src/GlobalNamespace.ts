export default class GlobalNamespace {
    private addedObjects: Map<string, any> = new Map();

    constructor() {}

    public add(name: string, object: any) {
        if (window[name]) return;
        window[name] = object;
        this.addedObjects.set(name, object);
    }

    public remove(name: string) {
        window[name] = null;
        this.addedObjects.delete(name);
    }

    dispose() {
        this.addedObjects.forEach((value, key) => {
           this.remove(key);
        });
    }
}