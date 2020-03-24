export abstract class Factory<T, U> {
    public __agentConstructor: Function;
    abstract get(params: U, classConstructor: Function): T;
    abstract update(params: any);
}