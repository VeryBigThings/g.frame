import {Constructor, FirstArgumentOfConstructor} from '../utils';

export class Factory<T> {
    public __agentConstructor: Function;
    public __constructor: new (...arg: any[]) => T;

    constructor() {
    }

    get(argument: FirstArgumentOfConstructor<Constructor<T>>): T {
        return null;
    }

    getFactory<T, U>(classConstructor: new (arg: U, ...args: any[]) => T): (arg: U) => T {
        return null;
    }

    update(params: any) {

    }
}