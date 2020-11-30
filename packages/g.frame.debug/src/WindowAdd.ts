export default class WindowAdd {
    private addedObjects: Array<any> = [];

    constructor() {}

    public addToWindow(name: string, object: any) {
        window[name] = object;
        this.addedObjects.push(object);
    }

    dispose() {
        this.addedObjects.forEach(el => {
           el.dispose && el.dispose();
        });
    }
}