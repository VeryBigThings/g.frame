import {Constructor} from '../utils';

export class ModulesStorage {
    private storage: Map<Function, any> = new Map<Function, any>();

    constructor() {
    }

    setModule<T extends Constructor<C>, C>(classConstructor: T, agent: C) {
        this.storage.set(classConstructor, agent);
    }

    getModule<C>(classConstructor: Constructor<C>): C {
        return this.storage.get(classConstructor);
    }
}