import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from 'g.frame.core';

export class PickingControllerModule extends AbstractModule {

    constructor() {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.warn('PickingControllerModule pre-initialization prevented. ' +
            'You need to extend this module, look `g.frame.oculus.quest` module.');
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