// import * as SPE from 'shader-particle-engine';
import * as SPE from 'shader-particle-engine';
import {Texture} from 'three';


export abstract class Preset {
    abstract getEmitter(): SPE.Emitter;

    abstract getGroup(texture: Texture): SPE.Group;

    abstract getTexturesLinks(): Array<string>;
}