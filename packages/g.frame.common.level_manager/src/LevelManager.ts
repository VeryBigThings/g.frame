import {ViewerModule, ParentEvent} from '@verybigthings/g.frame.core';
import {Loader, LoaderEventsName, ResourceRaw} from '@verybigthings/g.frame.common.loaders';
import {LevelManagerOptions, ScenarioItem} from './LevelManager_interfaces';
import {Level} from './Level';
import { Router } from './Router';



export class LevelManager extends ViewerModule {
    public name: string;
    public currentLevel: ScenarioItem;
    private router: Router;
    private scenario: Array<ScenarioItem>;

    constructor(options: LevelManagerOptions, private readonly loader: Loader<any>) {
        super();

        this.scenario = options.scenarios;
        this.router = new Router();
        this.name = options.name || 'NewLevelManager';

        this.showPreloader();

        const extraResources = this.collectResources();
        this.loader.addLoadResources(extraResources);

        this.loader.once(LoaderEventsName.loaded, () => {
            setTimeout(() => {
                this.changeLevel();
                this.hidePreloader();
            }, 100);
        });
        this.loader.load();
    }

    update() {
    }

    protected showPreloader() {
    }

    protected hidePreloader() {
    }

    private changeLevel(nextLevelName?: string, _event?: ParentEvent<string>) {
        const nextLevel = nextLevelName ? this.scenario.find(item => item.name === nextLevelName) : this.getMainLevel();

        const callback = (event: ParentEvent<string>) => {
            const oldLevel = this.currentLevel;
            for (let eventName in oldLevel.events) {
                oldLevel.instance.off(eventName, callback);
            }

            oldLevel.instance.endAnimation().then(() => {
                this.uiObject.remove(oldLevel.instance.uiObject);
                const newLevelName = oldLevel.events[event.eventName];
                const newLevel = this.scenario.find(item => item.name === newLevelName);

                if (!newLevel.loadForce && !newLevel.processed) {
                    this.showPreloader();
                    const newResources = this.prepareResources(newLevel);

                    this.loader.addResources(newResources);
                    this.loader.once(LoaderEventsName.loaded, () => {
                        newLevel.processed = true;
                        this.changeLevel(newLevelName, event);
                        this.hidePreloader();
                    });
                    this.loader.load();
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
        return this.scenario.filter(item => item.isMain)[0] ||
            this.scenario.filter(item => item.routerLink === this.router.currentURL)[0] ||
            this.scenario[0];
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
        const levels: Array<ScenarioItem> = [mainLevel].concat(this.scenario.filter(item => item.loadForce));
        // let flag = false;
        // do {
        //     const oldLevelsLength = levels.length;
        //     levels.forEach(item => {
        //         if (!item.processed) for (let key in item.events) {
        //             if (!levels.find(item2 => item2.name === item.events[key])) {
        //                 levels.push(this.scenario.find(item2 => item2.name === item.events[key]));
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
