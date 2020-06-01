import {Object3D, Vector3, MeshStandardMaterial, DirectionalLight, HemisphereLight, Mesh, BoxGeometry, Euler, Quaternion, PlaneGeometry, MeshBasicMaterial} from 'three';
import {FBX_MODEL, Loader, POSITIONAL_AUDIO, TEXTURE, VIDEO, LoaderEventsName} from '@verybigthings/g.frame.common.loaders';
import {PickingController, PickingControllerEvents} from '@verybigthings/g.frame.common.picking_controller';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';
import {MarkerBoardModule} from './BoardModule';
import { OrbitControls } from '@verybigthings/g.frame.desktop';
import {OculusQuestModel, OculusQuestModule} from '@verybigthings/g.frame.oculus.quest';
import { Locomotion } from '@verybigthings/g.frame.oculus.quest/build/main/OculusQuestControllers/OculusQuestCameraControls';

declare function require(s: string): string;

export class DrawLevel {
    private loader: Loader<any>;
    private pickingController: PickingController;
    private actionController: ActionController;
    private orbitControls: OrbitControls;
    private questModel: OculusQuestModel;

    private modelRoom: Object3D;
    private table: Object3D;
    private bottleGroup: Object3D;
    private markerBoardModule: MarkerBoardModule;

    constructor(private scene: Object3D) {
        this.initLights();

        window['tb'] = this;
    }

    prepareResources(loader: Loader<any>) {
        this.loader = loader;
        this.loader.addResources([
            {
                name: 'MODEL_robot_room',
                url: require('./assets/models/environment/robot_room.fbx'),
                type: FBX_MODEL
            }, {
                name: 'MODEL_table',
                url: require('./assets/models/environment/table.fbx'),
                type: FBX_MODEL
            }, {
                name: 'MODEL_glass_bottle',
                url: require('./assets/models/environment/glass_bottle.fbx'),
                type: FBX_MODEL
            }, {
                name: 'MODEL_marker_board',
                url: require('./assets/models/environment/marker_board-Y.fbx'),
                type: FBX_MODEL
            }, {
                name: 'sample_positional_audio',
                url: require('./assets/sounds/failFx.mp3'),
                type: POSITIONAL_AUDIO
            }, {
                name: 'TEXTURE_room',
                url: require('./assets/images/environment/room/room.jpg'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_stand',
                url: require('./assets/images/environment/room/stand.jpg'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_wall_details',
                url: require('./assets/images/environment/room/wall_details.jpg'),
                type: TEXTURE
            }, {
                name: 'sample_video',
                url: require('./assets/videos/placeholder.mp4'),
                type: VIDEO
            }, {
                name: 'TEXTURE_table_bc',
                url: require('./assets/images/environment/table/table_bc.png'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_table_arm',
                url: require('./assets/images/environment/table/table_arm.png'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_table_normal_gl',
                url: require('./assets/images/environment/table/table_normal_gl.png'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_glass_bottle_bc',
                url: require('./assets/images/environment/glass_bottle/glass_bottle_lowpoly_bc.png'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_glass_bottle_arm',
                url: require('./assets/images/environment/glass_bottle/glass_bottle_lowpoly_arm.png'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_glass_bottle_normal_gl',
                url: require('./assets/images/environment/glass_bottle/glass_bottle_lowpoly_normal_gl.png'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_marker_board_bc',
                url: require('./assets/images/environment/draw_board/marker_board_bc.jpg'),
                type: TEXTURE
            }, {
                name: 'TEXTURE_marker_board_ao',
                url: require('./assets/images/environment/draw_board/marker_board_ao.jpg'),
                type: TEXTURE
            }
        ]);


        this.loader.once(LoaderEventsName.loaded, () => this.addResources());
    }

    setPickingController(pickingController: PickingController) {
        this.pickingController = pickingController;
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    setOrbitControls(orbitControls: OrbitControls) {
        this.orbitControls = orbitControls;

        this.markerBoardModule.setOrbitControls(this.orbitControls);
    }

    addResources() {
        this.initRoom();
        this.initTable();
        this.initMarkerBoard();


        this.scene.add(this.bottleGroup = new Object3D());
        this.bottleGroup.position.set(0.4, 1.11, -2.4);
        this.bottleGroup.rotation.y = -1.04;

        this.initBottle(new Vector3(0.5, 0, -0.2));
        this.initBottle(new Vector3(0.5, 0, 0));
        this.initBottle(new Vector3(0.5, 0, 0.2));
    }

    setLocomotion(locomotion: Locomotion) {
        // this.questModel = questModel;

        // this.markerBoardModule.setQuestModel(this.questModel);




        const mesh = new Mesh(new PlaneGeometry(8, 8), new MeshBasicMaterial({color: 'green', visible: false}));
        mesh.userData.navMesh = true;
        mesh.rotation.set(-Math.PI/2, 0, 0);
        mesh.position.set(0, 0.001, 0);
        this.scene.add(mesh);
        locomotion.addNavigationMesh(mesh);
    }

    initMarkerBoard() {
        const markerBoardWrap = new Object3D();
        markerBoardWrap.name = 'markerBoardWrap';
        markerBoardWrap.position.set(-1, 0.25, -1.5);
        markerBoardWrap.rotation.y = 0.5;
        this.scene.add(markerBoardWrap);

        const wrapPencil = new Object3D();
        const pencil = new Mesh(
            new BoxGeometry(0.03, 0.03, 0.2),//.translate(0.08, 0.08, -0.06),
            new MeshStandardMaterial({color: 'red'})
        );
        wrapPencil.position.set(-0.9, 1.03, -1.41);
        wrapPencil.rotation.y = 2.12;
        wrapPencil.userData.posInHand = {
            position: new Vector3(0, 0.05, -0.2),
            rotation: new Euler(0, 0, 0),
        };
        wrapPencil.add(pencil);
        console.log('wrapPencil', wrapPencil);
        this.scene.add(wrapPencil);

        this.markerBoardModule = new MarkerBoardModule(markerBoardWrap, this.loader);
        this.markerBoardModule.setRaycastObject(wrapPencil);
        this.markerBoardModule.setActionController(this.actionController);

        const markerBoard = this.loader.getResource<Object3D>('MODEL_marker_board');
        markerBoard.position.set(-1, 0.25, -1.5);
        markerBoard.rotation.y = 0.5;
        // @ts-ignore
        markerBoard.children[0].material.map = this.loader.getResource('TEXTURE_marker_board_bc');
        this.scene.add(markerBoard);
    }

    initBottle(position: Vector3) {
        const bottle = this.loader.getResource<Object3D>('MODEL_glass_bottle').clone();
        bottle.position.copy(position);
        this.bottleGroup.add(bottle);
        console.log('bottle', bottle);

        const bottleMaterial = new MeshStandardMaterial({
            map: this.loader.getResource('TEXTURE_glass_bottle_bc'),
            normalMap: this.loader.getResource('TEXTURE_glass_bottle_normal_gl'),
            roughnessMap: this.loader.getResource('TEXTURE_glass_bottle_arm'),
            metalnessMap: this.loader.getResource('TEXTURE_glass_bottle_arm'),
        });
        bottle.traverse(object => {
            // @ts-ignore
            if (object.isMesh) object.material = bottleMaterial;
        });
    }

    initRoom() {
        this.scene.add(this.modelRoom = this.loader.getResource<Object3D>('MODEL_robot_room'));
        this.modelRoom.position.set(-1, 0, -1.5);
        this.modelRoom.rotation.x = -Math.PI / 2;

        this.modelRoom.traverse(object => {
           // @ts-ignore
           if (object.isMesh) {
               // if (object.name === 'stand') object.visible = false;
               // @ts-ignore
               // object.material = new MeshStandardMaterial();
               // @ts-ignore
               object.material.map = this.loader.getResource('TEXTURE_' + object.name);
           }
        });
    }

    initTable() {
        this.scene.add(this.table = this.loader.getResource<Object3D>('MODEL_table'));
        this.table.position.set(0.4, 0, -2.4);
        this.table.rotation.y = -1.04;

        const tableMaterial = new MeshStandardMaterial({
            map: this.loader.getResource('TEXTURE_table_bc'),
            normalMap: this.loader.getResource('TEXTURE_table_normal_gl'),
            roughnessMap: this.loader.getResource('TEXTURE_table_arm'),
            metalnessMap: this.loader.getResource('TEXTURE_table_arm'),
        });
        this.table.traverse(object => {
            // @ts-ignore
            if (object.isMesh) object.material = tableMaterial;
        });
    }

    initLights() {
        const dirLight = new DirectionalLight(0xffffff, 0.2);
        console.log('dirLight', dirLight);
        dirLight.position.set(2, 10, 5);
        this.scene.add(dirLight);

        const dirLight2 = new DirectionalLight(0xffffff, 0.15);
        console.log('dirLight2', dirLight2);
        dirLight2.position.set(-5, 10, 1);
        this.scene.add(dirLight2);

        const hemisphereLight = new HemisphereLight(0xffffff, 0xaaaaaa, 1.3);
        this.scene.add(hemisphereLight);
    }
}