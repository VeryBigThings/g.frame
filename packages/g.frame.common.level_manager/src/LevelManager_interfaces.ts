import {Level} from './Level';

export interface ScenarioItem {
    name: string;
    isMain?: boolean;
    events?: object;
    instance: Level;
    loadForce?: boolean;
    routerLink?: string;
    processed?: boolean;
    showPreloader?: boolean;
}

export interface LevelManagerOptions {
    name: string;
    scenarios: Array<ScenarioItem>;
}