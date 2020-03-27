import * as SPE from '@verybigthings/shader-particle-engine';
import {FallPreset, Preset, SpringPreset, WinterPreset} from './presets';
import {Object3D} from 'three';
import {ResourcesManager} from '@verybigthings/g.frame.core';

export enum PresetType {
    winter = 'winter',
    spring = 'spring',
    fall = 'fall',
}

export class PresetsRunner {

    private particleGroups: Array<SPE.Group> = [];
    private particleEmitters: Array<SPE.Emitter> = [];
    private readonly resourcesManager: ResourcesManager;
    private presetMap: Map<string, Preset> =
        new Map<PresetType, Preset>([
            [PresetType.winter, new WinterPreset],
            [PresetType.spring, new SpringPreset],
            [PresetType.fall, new FallPreset]]);

    constructor(options: {
        resourcesManager: ResourcesManager,
        presetsToLoad?: Array<PresetType>
    }) {
        this.resourcesManager = options.resourcesManager;
        options?.presetsToLoad?.forEach(presetName => {
            const preset = this.presetMap.get(presetName);

            preset.getTexturesLinks().map((link, i) => {
                options?.resourcesManager?.addLoadResources([{
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
                .getLoader('texture')
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