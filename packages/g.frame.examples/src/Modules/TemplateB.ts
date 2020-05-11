import {TemplateA} from './TemplateA';
import {Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, PositionalAudio, Scene, PointLight, LineCurve, AmbientLight} from 'three';
import {FBX_MODEL, Loader, POSITIONAL_AUDIO, TEXTURE, VIDEO, DAE_MODEL, GLTF_MODEL, OBJ_MODEL, OBJ2_MODEL} from '@verybigthings/g.frame.common.loaders';
import {PickingController, PickingControllerEvents} from '@verybigthings/g.frame.common.picking_controller';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';
import {LoaderEventsName} from '@verybigthings/g.frame.common.loaders/build/main';

declare function require(s: string): string;

export class TemplateB extends TemplateA {
    private loader: Loader<any>;
    private pickingController: PickingController;
    private actionController: ActionController;

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
                name: 'sample_model_collada',
                url: require('./assets/models/collada/elf/elf.dae'),
                type: DAE_MODEL
            }, {
                name: 'sample_model_gltf',
                url: require('./assets/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf'),
                type: GLTF_MODEL
            }, {
                name: 'sample_model_obj',
                url: require('./assets/models/obj/male02/male02.obj'),
                type: OBJ_MODEL
            }, {
                name: 'sample_model_obj2',
                url: require('./assets/models/obj/female02/female02.obj'),
                type: OBJ2_MODEL
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


        this.loader.once(LoaderEventsName.loaded, () => this.addResources());
    }

    setPickingController(pickingController: PickingController) {
        this.pickingController = pickingController;
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    addResources() {
        let modelCollada, modelGltf, modelObj, modelObj2;

        modelCollada = this.loader.getResource<Object3D>('sample_model_collada');
        modelGltf = this.loader.getResource<Object3D>('sample_model_gltf');
        modelObj = this.loader.getResource<Object3D>('sample_model_obj');
        modelObj2 = this.loader.getResource<Object3D>('sample_model_obj2');

        modelCollada.scale.set(0.25, 0.25, 0.25);
        modelGltf.scale.set(0.25, 0.25, 0.25);
        modelObj.scale.set(0.01, 0.01, 0.01);
        modelObj2.scale.set(0.01, 0.01, 0.01);

        modelCollada.position.set(-4, 0, -1.5);
        modelGltf.position.set(3.5, 1.5, -1.5);
        modelObj.position.set(-2.5, 0, -1.5);
        modelObj2.position.set(2.5, 0, -1.5);

        modelCollada.visible = false;

        this.scene.add(modelCollada, modelGltf, modelObj, modelObj2, new AmbientLight());


        let model, audio, plane;
        this.scene.add(model = this.loader.getResource<Object3D>('sample_model'));
        this.scene.add(audio = this.loader.getResource<PositionalAudio>('sample_positional_audio'));
        this.scene.add(
            plane = new Mesh(
                new PlaneGeometry(0.3, 0.3),
                new MeshBasicMaterial({
                    color: 'white',
                    map: this.loader.getResource('sample_texture')
                })));


        model.position.set(-1, 0, -1.5);
        plane.position.set(1, 0, -1.5);
        audio.position.set(0, 0, -1.5);


        if (this.pickingController) this.pickingController.on(PickingControllerEvents.MOVED, plane, () => {});
    }


}