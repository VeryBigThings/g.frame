import {TemplateA} from './TemplateA';
import {Mesh, MeshBasicMaterial, Object3D, PlaneGeometry} from 'three';
import {Loader} from '@verybigthings/g.frame.common.loaders';

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
                type: 'fbxModel'
            }, {
                name: 'sample_positional_audio',
                url: require('./assets/sounds/failFx.mp3'),
                type: 'positional_audio'
            }, {
                name: 'sample_texture',
                url: require('./assets/images/logo.png'),
                type: 'texture'
            }, {
                name: 'sample_video',
                url: require('./assets/videos/placeholder.mp4'),
                type: 'video'
            },
        ]);


        this.loader.on('loaded', () => this.addResources());
    }

    addResources() {
        let model, audio, plane;
        this.scene.add(model = this.loader.getResource('sample_model'));
        this.scene.add(audio = this.loader.getResource('sample_positional_audio'));
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