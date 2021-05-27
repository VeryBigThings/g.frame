import * as SPE from '@g.frame/shader-particle-engine';
import {Color, NormalBlending, Texture, Vector2, Vector3} from 'three';
import {Preset} from './Preset';

declare function require(s: string): string;

export class FallPreset implements Preset {
    getEmitter() {
        return new SPE.Emitter({
            type: SPE.distributions.BOX,
            maxAge: {
                value: 16
            },
            position: {
                value: new Vector3(0, 2, 0),
                spread: new Vector3(9, 0, 9)
            },
            wiggle: {
                value: 4,
                spread: 6
            },
            angle: {
                value: 0,
                spread: Math.PI / 2,
                randomise: true
            },

            acceleration: {
                value: new Vector3(0, -0.02, 0),
                spread: new Vector3(0.001, 0.002, 0.001)
            },

            velocity: {
                value: new Vector3(-0.2, -0.04, 0.1),
                spread: new Vector3(0, 0.01, 0)
            },

            color: {
                value: [new Color(0xFFFFFF)]
            },

            opacity: {
                value: 1
            },

            size: {
                value: 0.5,
                spread: 0.05
            },
            activeMultiplier: 0.5,
            particleCount: 50
        });
    }

    getGroup(texture: Texture) {
        return new SPE.Group({
            texture: {
                value: texture,
                frames: new Vector2(6, 5),
                frameCount: 9,
                loop: 30,
            },
            fog: false,
            colorize: false,
            blending: NormalBlending,
        });
    }

    getTexturesLinks() {
        return [
            require('../assets/textures/particles_leaf_1.png'), require('../assets/textures/particles_leaf_2.png')
        ];
    }

}