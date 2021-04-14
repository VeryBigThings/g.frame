import {ViewerModule, ParentEvent} from 'g.frame.core';
import {ResourceRaw} from 'g.frame.common.loaders';

export class Level extends ViewerModule {
    public __inited: boolean = false;
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
