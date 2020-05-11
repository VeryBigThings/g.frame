export type FirstArgumentOfConstructor<T> = T extends new(arg1: infer U, ...args: any[]) => any ? U : never;
export type Constructor<T> = new (...args: any[]) => T;