import {AbstractModule} from '../../core';
import {Constructor} from '../ExtraTypes';

export function requires(params: { modules: Array<Constructor<AbstractModule>> }) {
    return function (constructor: Constructor<AbstractModule>) {
        constructor.prototype.__requiredModules = params.modules;
    };
}