import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@g.frame/core';

export class ActionControllerModule extends AbstractModule {

    constructor() {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.warn('ActionControllerModule pre-initialization prevented. ' +
            'You need to extend this module, look `g.frame.desktop` module.');
        return {
            enabled: false
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        return [];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
    }

    onDestroy(): void {
    }

    onResume(): void {
    }

    onPause(): void {
    }
}