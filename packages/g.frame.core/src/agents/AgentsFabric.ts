export namespace AgentsFabric {
    export function createUniversalAgent(instances: Array<any>) {
        const agent = {};
        const object = instances[0].__proto__.__proto__;
        for (let key of Object.keys(Object.getOwnPropertyDescriptors(object))) {
            if (object.hasOwnProperty(key) && object[key] instanceof Function && key !== 'constructor') {
                agent[key] = () => {
                    const returnedValues = [];
                    for (let instance of instances) {
                        const value = instance[key].call(instance, ...arguments);
                        if (value != null) returnedValues.push(value);
                    }
                    return;
                };
            }
        }
        return agent;
    }
}