import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import {PresetsRunner, PresetType} from './PresetsRunner';
import {Loader} from '@verybigthings/g.frame.common.loaders';

export class EffectsSPEModule extends AbstractModule {
    public presetsRunner: PresetsRunner;

    constructor(private options?: {
        presetsToLoad?: Array<PresetType>
    }) {
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

    onResourcesReady(): void {
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.presetsRunner.prepareLoader({
            presetsToLoad: this.options?.presetsToLoad,
            resourcesManager: agents.get(Loader)
        });
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