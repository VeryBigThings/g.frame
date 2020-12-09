import {AbstractModule, GComponent} from '../../core';
import {Constructor} from '../ExtraTypes';

export function requires(params: { modules: Array<Constructor<AbstractModule>> }) {
    return function (constructor: Constructor<AbstractModule>) {
        constructor.prototype.__requiredModules = params.modules;
    };
}


export function GModule(params: {
    imports: Array<Constructor<AbstractModule>>,
    bootstrap: B
}) {
    return function (constructor: Constructor<AbstractModule>) {
        constructor.prototype.__requiredModules = params.modules;
    };
}