import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {IVBTubeVideoPlayerOptions, VBTubeVideoPlayer} from './VBTubeVideoPlayer';

export class VBTubeVideoPlayerFactory extends Factory<VBTubeVideoPlayer> {
    __constructor: typeof VBTubeVideoPlayer = VBTubeVideoPlayer;
    private components: Array<VBTubeVideoPlayer>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: IVBTubeVideoPlayerOptions): VBTubeVideoPlayer {
        const component = new VBTubeVideoPlayer(params, this.actionController, {enableRotate: true});
        this.components.push(component);
        component.on('dispose', (event: ParentEvent<string>) => this.onDispose(component, event.data.disposedObject));

        return component;
    }

    onDispose(component: VBTubeVideoPlayer, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: { currentTime: number; frame: any }): any {
        this.components.forEach(video => {
            video.update();
        });
    }
}