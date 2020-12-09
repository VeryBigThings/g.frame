import {Constructor, FirstArgumentOfConstructor} from '../utils';
import {AbstractModule, AbstractModuleStatus, ModulesProcessor} from '../core';
import {OculusQuestModule} from '../../../g.frame.oculus.quest/src';
import {PresetsRunner, PresetType} from '../../../g.frame.effects.spe/src';

export interface OnInit {
    gOnInit(modulesProcessor: ModulesProcessor): void;
}

export interface OnUpdate {
    gOnUpdate(params: { currentTime: number; frame: any }): void;
}

export interface OnDestroy {
    gOnDestroy(): void;
}

export interface OnPause {
    gOnPause(): void;
}

export interface OnResume {
    gOnResume(): void;
}

export interface OnSetup {
    gOnSetup(modulesConfiguration: Map<Constructor<AbstractModule>, FirstArgumentOfConstructor<AbstractModule>>): void;
}
export class EffectsSPEModule extends AbstractModule {

    constructor(private options?: {asd: number}) {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        return [];
    }

    onResourcesReady(): void {
    }

    afterInit(): void {

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



const a: Map<new (...args: any[]) => AbstractModule, FirstArgumentOfConstructor<new (...args: any[]) => AbstractModule>> = new Map<Constructor<AbstractModule>, FirstArgumentOfConstructor<AbstractModule>>();

const b: new (...args: any[]) => AbstractModule = EffectsSPEModule;
const d: ;



a.set(EffectsSPEModule, {zxc: 1});
