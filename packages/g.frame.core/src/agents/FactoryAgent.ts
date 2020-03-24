import {Factory} from '../common/Factory';

export class FactoryAgent extends Factory<any, any> {

    constructor(private instances: Array<Factory<any, any>>) {
        super();
    }

    get<T, U>(params: U, classConstructor?: new () => T): T {
        const components = this.instances.map(instance => instance.get(params, classConstructor)).filter(el => !!el);
        return components[0];
    }

    update(params: any) {
    }
}

Factory.prototype.__agentConstructor = FactoryAgent;