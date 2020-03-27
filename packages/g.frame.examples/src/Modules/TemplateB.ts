import {TemplateA} from './TemplateA';
import {ResourcesManager} from '@verybigthings/g.frame.core';
import {Mesh, MeshBasicMaterial, Object3D, PlaneGeometry} from 'three';

declare function require(s: string): string;

export class TemplateB extends TemplateA {
    constructor(private resourcesManager: ResourcesManager, private scene: Object3D) {
        super();

        this.resourcesManager.addLoadResources([
            {
                name: 'sample_model',
                url: require('./assets/models/arrow.fbx'),
                type: 'model'
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
    }

    addResources() {
        let model, audio, plane;
        this.scene.add(model = this.resourcesManager.getLoader('model').getResource('sample_model'));
        this.scene.add(audio = this.resourcesManager.getLoader('positional_audio').getResource('sample_positional_audio'));
        this.scene.add(
            plane = new Mesh(
                new PlaneGeometry(1, 1),
                new MeshBasicMaterial({
                    map: this.resourcesManager.getLoader('texture').getResource('sample_texture')
                })));


        model.position.set(-3, 0, 0);
        plane.position.set(3, 0, 0);
        audio.position.set(0, 0, 0);
    }


}