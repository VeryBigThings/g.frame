export namespace AgentsFabric {
    export function createUniversalAgent<T>(instances: Array<T>): T {
        const agent = {};
        for(let key in object)
        {
            if(object.hasOwnProperty(key) && object[key] instanceof Function)
            {
                agent[key] =  () => {
                    const returnedValues = [];
                    for (let instance of instances)
                    {
                        const value = returninstance[key].call(instance, ...arguments);
                        if(value != null) returnedValues.push(value);
                    }
                    return
                }
            }
        }
        return agent;
    }
}