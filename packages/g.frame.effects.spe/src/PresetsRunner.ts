import * as SPE from '@verybigthings/shader-particle-engine';
import {FallPreset, Preset, SpringPreset, WinterPreset} from './presets';
import {Object3D, TextureLoader} from 'three';

export class PresetsRunner {

    private particleGroups: Array<SPE.Group> = [];
    private particleEmitters: Array<SPE.Emitter> = [];

    private presetMap: Map<string, Preset> =
        new Map<string, Preset>([
            ['winter', new WinterPreset],
            ['spring', new SpringPreset],
            ['fall', new FallPreset]]);

    constructor() {
    }

    runPreset(presetName: string): Array<Object3D> {
        const preset = this.presetMap.get(presetName);

        return preset.getTexturesLinks().map(link => {
            const particleEmitter = preset.getEmitter();
            const particleGroup = preset.getGroup(new TextureLoader().load(link));
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