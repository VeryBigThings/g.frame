import {EventDispatcher} from '@verybigthings/g.frame.core';

enum RouterEventsName {
    change = 'change'
}

export class Router extends EventDispatcher<RouterEventsName> {
    public currentURL: string;
    private _onHashChange: () => void;
    private registeredHashes: Array<any>;

    constructor() {
        super();

        this._onHashChange = this.onHashChange.bind(this);
        window.addEventListener('hashchange', this._onHashChange, false);
        this.on(RouterEventsName.change, () => {
            this.currentURL = location.hash || '';
            if (~this.currentURL.indexOf('?')) {
                this.currentURL = this.currentURL.substring(0, this.currentURL.indexOf('?'));
            }

            this.registeredHashes.filter(el => location.hash.indexOf(el.url) === 0).forEach(el => el.callback());
        });
        this.fire(RouterEventsName.change);
    }

    register(url: string, callback: Function) {
        this.registeredHashes.push({url: url, callback: callback});
    }

    dispose() {
        window.removeEventListener('hashchange', this._onHashChange);
        this.off(RouterEventsName.change);
    }

    private onHashChange() {
        this.fire(RouterEventsName.change);
    }
}
