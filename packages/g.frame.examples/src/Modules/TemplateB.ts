import {TemplateA} from './TemplateA';
import {Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, PositionalAudio} from 'three';
import {FBX_MODEL, Loader, POSITIONAL_AUDIO, TEXTURE, VIDEO} from '@verybigthings/g.frame.common.loaders';

declare function require(s: string): string;

export class TemplateB extends TemplateA {
    private loader: Loader<any>;

    constructor(private scene: Object3D) {
        super();


    }

    prepareResources(loader: Loader<any>) {
        this.loader = loader;
        this.loader.addResources([
            {
                name: 'sample_model',
                url: require('./assets/models/arrow.fbx'),
                type: FBX_MODEL
            }, {
                name: 'sample_positional_audio',
                url: require('./assets/sounds/failFx.mp3'),
                type: POSITIONAL_AUDIO
            }, {
                name: 'sample_texture',
                url: require('./assets/images/logo.png'),
                type: TEXTURE
            }, {
                name: 'sample_video',
                url: require('./assets/videos/placeholder.mp4'),
                type: VIDEO
            },
        ]);


        this.loader.once('loaded', () => this.addResources());
    }

    addResources() {
        let model, audio, plane;
        this.scene.add(model = this.loader.getResource<Object3D>('sample_model'));
        this.scene.add(audio = this.loader.getResource<PositionalAudio>('sample_positional_audio'));
        this.scene.add(
            plane = new Mesh(
                new PlaneGeometry(1, 1),
                new MeshBasicMaterial({
                    map: this.loader.getResource('sample_texture')
                })));


        model.position.set(-3, 0, 0);
        plane.position.set(3, 0, 0);
        audio.position.set(0, 0, 0);
    }


}