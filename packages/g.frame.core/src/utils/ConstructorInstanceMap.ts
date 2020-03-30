import {Constructor} from './index';

export class ConstructorInstanceMap<C> extends Map<new (...args: any) => C, C> {
    constructor() {
        super();
    }

    set<T extends Constructor<P>, P extends C>(classConstructor: T, agent: P) {
        super.set(classConstructor, agent);
        return this;
    }

    get<P extends C>(classConstructor: Constructor<P>): P {
        return <P> super.get(classConstructor);
    }
}