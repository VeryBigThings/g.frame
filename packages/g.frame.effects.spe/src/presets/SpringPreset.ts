// import * as SPE from '@verybigthings/shader-particle-engine';
import * as SPE from 'shader-particle-engine';
import {Color, NormalBlending, Texture, Vector2, Vector3} from 'three';
import {Preset} from './Preset';

declare function require(s: string): string;

export class SpringPreset implements Preset {
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
                value: 5,
                spread: 4
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
                value: new Vector3(0.2, -0.01, 0.1),
                spread: new Vector3(0, 0.01, 0)
            },

            color: {
                value: [new Color(0xFFFFFF)]
            },

            opacity: {
                value: [0.95, 0.7]
            },

            size: {
                value: 0.25,
                spread: 0.05
            },
            activeMultiplier: 0.5,
            particleCount: 150
        });
    }

    getGroup(texture: Texture) {
        return new SPE.Group({
            texture: {
                value: texture,
                frames: new Vector2(7, 5),
                frameCount: 7,
                loop: 31,
            },
            fog: false,
            colorize: false,
            blending: NormalBlending,
        });
    }

    getTexturesLinks() {
        return [
            require('../assets/textures/particles_petal_1.png'), require('../assets/textures/particles_petal_2.png'), require('../assets/textures/particles_petal_3.png')
        ];
    }

}