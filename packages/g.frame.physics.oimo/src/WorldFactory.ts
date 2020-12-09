import {Factory, ParentEvent, GComponent} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
import DebugDraw = oimo.dynamics.common.DebugDraw;

export class WorldFactory extends Factory<World> {
    __constructor: typeof World = World;
    private worldList: Array<World>;

    constructor() {
        super();
        this.worldList = [];
    }

    get(params: {broadPhaseType?: number, gravity?: oimo.common.Vec3}): World {
        const world = new World(params?.broadPhaseType, params?.gravity);
        world.setDebugDraw(new DebugDraw());
        this.worldList.push(world);

        return world;
    }

    update(params?: any): any {
        this.worldList.forEach(world => {
            world.step(1 / 60);
            world.debugDraw();
        });
    }
}