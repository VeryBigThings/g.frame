// import * as SPE from 'shader-particle-engine';
import * as SPE from 'shader-particle-engine';
import {FallPreset, Preset, SpringPreset, WinterPreset} from './presets';
import {Object3D} from 'three';
import {Loader} from '@verybigthings/g.frame.common.loaders';

export enum PresetType {
    winter = 'winter',
    spring = 'spring',
    fall = 'fall',
}

export class PresetsRunner {

    private particleGroups: Array<SPE.Group> = [];
    private particleEmitters: Array<SPE.Emitter> = [];
    private resourcesManager: Loader<any>;
    private presetMap: Map<string, Preset> =
        new Map<PresetType, Preset>([
            [PresetType.winter, new WinterPreset],
            [PresetType.spring, new SpringPreset],
            [PresetType.fall, new FallPreset]]);

    constructor() {

    }

    prepareLoader(options: {
        presetsToLoad?: Array<PresetType>,
        resourcesManager: Loader<any>
    }) {
        this.resourcesManager = options.resourcesManager;
        options?.presetsToLoad?.forEach(presetName => {
            const preset = this.presetMap.get(presetName);

            preset.getTexturesLinks().map((link, i) => {
                options?.resourcesManager?.addResources([{
                    name: `EffectsSPE_texture_${presetName}_${i}`,
                    type: 'texture',
                    url: link
                }]);
            });
        });
    }

    runPreset(presetName: PresetType): Array<Object3D> {
        const preset = this.presetMap.get(presetName);

        return preset.getTexturesLinks().map((link, i) => {
            const particleEmitter = preset.getEmitter();
            const particleGroup = preset.getGroup(this.resourcesManager
                .getResource('texture')
                .getResource(`EffectsSPE_texture_${presetName}_${i}`));
            particleGroup.addEmitter(particleEmitter);

            this.particleGroups.push(particleGroup);
            this.particleEmitters.push(particleEmitter);

            return particleGroup.mesh;
        });

    }

    getPresetNames(): Array<string> {
        const names = [];
        this.presetMap.forEach((value, key) => names.push(key));
        return names;
    }


    update() {
        this.particleGroups.forEach(el => el.tick(1 / 30));
    }

}