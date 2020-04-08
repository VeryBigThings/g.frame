import {ViewerModule, ParentEvent} from '@verybigthings/g.frame.core';
import {ResourceRaw, Loader} from '@verybigthings/g.frame.common.loaders';


declare function require(s: string): string;

export class Level extends ViewerModule {
    public __inited: boolean = false;
    private loader: Loader<any>;
    public resourcesInUse: Array<ResourceRaw> = [];

    constructor() {
        super();

        this.resourcesInUse = [];
    }

    public init(event?: ParentEvent<string>) {
        this.__inited = true;
    }

    public destroy() {
        this.fire('destroy');
        this.dispose();
    }

    public startAnimation() {
        return new Promise(resolve => {
            resolve();
        });
    }

    public endAnimation() {
        return new Promise(resolve => {
            resolve();
        });
    }
}
