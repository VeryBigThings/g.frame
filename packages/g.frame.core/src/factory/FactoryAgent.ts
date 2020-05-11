import {Factory} from '../factory/Factory';

export class FactoryAgent extends Factory<any> {
    __constructor: { new(...arg: any[]): any };

    constructor(private instances: Array<Factory<any>>) {
        super();
        this.instances.filter(factory => {
            if (!factory.__constructor) {
                console.error('Factory has no `__constructor` class member.', factory);
            }
        });
    }

    get(arg: any): any {
        return null;
    }

    getFactory<T, U>(classConstructor: new (arg: U, ...args: any[]) => T): (arg: U) => T {
        const factory = this.instances.filter(instance => instance.__constructor === classConstructor)[0];
        if (!factory) {
            console.error('No factory for constructor was found', classConstructor);
            throw new Error('No factory for constructor was found');
        }
        return factory.get.bind(factory);
    }

    update(params: any) {
    }
}

Factory.prototype.__agentConstructor = FactoryAgent;