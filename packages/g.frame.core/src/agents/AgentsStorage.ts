import {Constructor} from '../utils';

export class AgentsStorage {
    private storage: Map<Function, any> = new Map<Function, any>();

    constructor() {
    }

    setAgent<T extends Constructor<C>, C>(classConstructor: T, agent: C) {
        this.storage.set(classConstructor, agent);
    }

    getAgent<C>(classConstructor: Constructor<C>): C {
        return this.storage.get(classConstructor);
    }
}