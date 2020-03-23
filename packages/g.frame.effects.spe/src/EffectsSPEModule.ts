import {AbstractModule, AbstractModuleStatus} from '@verybigthings/g.frame.core';
import {PresetsRunner} from './PresetsRunner';

export class EffectsSPEModule extends AbstractModule {
    public presetsRunner: PresetsRunner;

    constructor() {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        return [
            this.presetsRunner = new PresetsRunner(),
        ];
    }

    afterInit(): void {
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        this.presetsRunner.update();
    }

    onDestroy(): void {
    }

    onResume(): void {
    }

    onPause(): void {
    }
}