import {ViewerModule, ParentEvent} from '@g.frame/core';
import {Loader, LoaderEventsName, ResourceRaw} from '@g.frame/common.loaders';
import {LevelManagerOptions, ScenarioItem} from './LevelManager_interfaces';
import {Level} from './Level';
import { Router } from './Router';


export class LevelManager extends ViewerModule {
    public name: string;
    public currentLevel: ScenarioItem;
    private _router: Router;
    private _scenario: Array<ScenarioItem>;

    constructor(options: LevelManagerOptions, private readonly _loader: Loader<any>) {
        super();

        this._scenario = options.scenarios;
        this._router = new Router();
        this.name = options.name || 'NewLevelManager';

        this.showPreloader();

        const extraResources = this.collectResources();
        this._loader.addResources(extraResources);

        this._loader.once(LoaderEventsName.loaded, () => {
            setTimeout(() => {
                this.changeLevel();
                this.hidePreloader();
            }, 100);
        });
        this._loader.load();
    }

    get loader(): Loader<any> {
        return this._loader;
    }

    get router(): Router {
        return this._router;
    }

    set router(value: Router) {
        console.error('You are trying to redefine instance in LevelManager');
    }

    get scenario(): Array<ScenarioItem> {
        return this._scenario;
    }

    set scenario(value: Array<ScenarioItem>) {
        console.error('You are trying to redefine instance in LevelManager');
    }

    update() {
    }

    protected showPreloader() {
    }

    protected hidePreloader() {
    }

    private changeLevel(nextLevelName?: string, _event?: ParentEvent<string>) {
        const nextLevel = nextLevelName ? this._scenario.find(item => item.name === nextLevelName) : this.getMainLevel();

        const callback = (event: ParentEvent<string>) => {
            const oldLevel = this.currentLevel;
            for (let eventName in oldLevel.events) {
                oldLevel.instance.off(eventName, callback);
            }

            oldLevel.instance.endAnimation().then(() => {
                this.uiObject.remove(oldLevel.instance.uiObject);
                const newLevelName = oldLevel.events[event.eventName];
                const newLevel = this._scenario.find(item => item.name === newLevelName);

                if (!newLevel.loadForce && !newLevel.processed) {
                    this.showPreloader();
                    const newResources = this.prepareResources(newLevel);

                    this._loader.addResources(newResources);
                    this._loader.once(LoaderEventsName.loaded, () => {
                        newLevel.processed = true;
                        this.changeLevel(newLevelName, event);
                        this.hidePreloader();
                    });
                    this._loader.load();
                } else {
                    this.changeLevel(newLevelName, event);
                }
            });

        };

        this.currentLevel = nextLevel;

        if (this.currentLevel.instance instanceof Level) {
            for (let eventName in this.currentLevel.events)
                this.currentLevel.instance.on(eventName, callback);
            if (!this.currentLevel.instance.__inited) this.currentLevel.instance.init(_event);
            this.uiObject.add(this.currentLevel.instance.uiObject);
            this.currentLevel.instance.startAnimation().then(() => {

            });
        }

        this.fire('level_changed', new ParentEvent('level_changed', {levelName: nextLevelName}));
    }

    private getMainLevel(): ScenarioItem {
        return this._scenario.filter(item => item.isMain)[0] ||
            this._scenario.filter(item => item.routerLink === this._router.currentURL)[0] ||
            this._scenario[0];
    }

    private prepareResources(scenario: ScenarioItem): Array<ResourceRaw> {
        const resources = scenario.instance.resourcesInUse;
        return this.setUniqueResources(resources);
    }

    private setUniqueResources(resources): Array<ResourceRaw> {
        const resourcesUnique: Array<ResourceRaw> = [];
        resources.forEach(resource => !resourcesUnique.filter(r => r.name === resource.name).length && resourcesUnique.push(resource));
        return resourcesUnique;
    }

    private collectResources(): Array<ResourceRaw> {
        const mainLevel = this.getMainLevel();
        const levels: Array<ScenarioItem> = [mainLevel].concat(this._scenario.filter(item => item.loadForce));
        // let flag = false;
        // do {
        //     const oldLevelsLength = levels.length;
        //     levels.forEach(item => {
        //         if (!item.processed) for (let key in item.events) {
        //             if (!levels.find(item2 => item2.name === item.events[key])) {
        //                 levels.push(this._scenario.find(item2 => item2.name === item.events[key]));
        //             }
        //         }
        //     });
        //     flag = levels.length > oldLevelsLength;
        // } while (flag);
        let resources: Array<ResourceRaw> = [];
        levels.forEach(item => resources = resources.concat(item.instance.resourcesInUse));
        return this.setUniqueResources(resources);
    }
}
