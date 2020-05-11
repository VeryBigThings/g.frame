import * as SPE from '@verybigthings/shader-particle-engine';
import {Color, NormalBlending, Texture, Vector2, Vector3} from 'three';
import {Preset} from './Preset';

declare function require(s: string): string;

export class WinterPreset implements Preset {
    getEmitter() {
        return new SPE.Emitter({
            maxAge: {
                value: 16
            },
            position: {
                value: new Vector3(0, 6, 0),
                spread: new Vector3(9, 0, 9)
            },
            acceleration: {
                value: new Vector3(0, -0.02, 0),
            },
            velocity: {
                value: new Vector3(0, -0.04, 0),
                spread: new Vector3(0.5, -0.01, 0.2)
            },
            color: {
                value: [new Color(0xCCCCFF)]
            },
            opacity: {
                value: [1, 0.8]
            },
            size: {
                value: [0.05, 0.1],
                spread: [0.05, 0.1]
            },
            activeMultiplier: 0.5,
            particleCount: 3000
        });
    }

    getGroup(texture: Texture) {
        return new SPE.Group({
            texture: {
                value: texture,
                frames: new Vector2(1, 1),
                frameCount: 1,
                loop: 1,
            },
            fog: false,
            colorize: false,
            blending: NormalBlending,
        });
    }

    getTexturesLinks() {
        return [
            require('../assets/textures/particles_snowflake.png')
        ];
    }

}