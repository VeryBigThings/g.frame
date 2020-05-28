import {Object3D, Vector3, MeshStandardMaterial, DirectionalLight, HemisphereLight, Mesh, PlaneGeometry, MeshBasicMaterial, Texture, Color, Box3, BoxGeometry, Vector2} from 'three';
import {FBX_MODEL, Loader, POSITIONAL_AUDIO, TEXTURE, VIDEO} from '@verybigthings/g.frame.common.loaders';
import {PickingController, PickingControllerEvents} from '@verybigthings/g.frame.common.picking_controller';
import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import { ViewerModule } from '@verybigthings/g.frame.core';
import {OrbitControls} from '@verybigthings/g.frame.desktop';
import {OculusQuestModel} from '@verybigthings/g.frame.oculus.quest';

declare function require(s: string): string;

export class MarkerBoardModule extends ViewerModule {
    private loader: Loader<any>;
    private pickingController: PickingController;
    private actionController: ActionController;
    private orbitControls: OrbitControls;
    private questModel: OculusQuestModel;
    private isPencilInHand: boolean = false;

    private drawCanvasCTX: any;
    private drawCanvas: HTMLCanvasElement;
    private drawPlane: Mesh;
    private markerBoardModel: Object3D;
    private drawObject: Object3D;

    private drawingMode: boolean = false;

    constructor(private scene: Object3D, loader: Loader<any>) {
        super();

        window['mbm'] = this;

        this.loader = loader;
        this.markerBoardModel = this.loader.getResource<Object3D>('MODEL_marker_board');
        this.scene.add(this.markerBoardModel);

        this.initDrawPlane();
    }

    initEvents() {
        let isFirstPoint = true;

        this.actionController.on(ActionControllerEventName.click, null, (event) => {
            if (!this.isPencilInHand) {
                const positionRightController = event.data.context.oculusQuestModel.mainContainer.localToWorld(event.data.context.oculusQuestModel.model.right.pose.position.clone());
                console.log('event', positionRightController.distanceTo(this.drawObject.position));

                if (positionRightController.distanceTo(this.drawObject.position) < 0.4) {
                    this.isPencilInHand = true;
                    this.drawObject.children[0].position.copy(this.drawObject.userData.posInHand.position);
                    this.drawObject.children[0].rotation.copy(this.drawObject.userData.posInHand.rotation);
                }
            }
            else {
                this.isPencilInHand = false;
            }
        });

        this.actionController.on(ActionControllerEventName.move, null, (event) => {
            if (!this.isPencilInHand) return;
            if (!event.data.context.oculusQuestModel) return;

            const posRightController = event.data.context.oculusQuestModel.mainContainer.localToWorld(event.data.context.oculusQuestModel.model.right.pose.position.clone());
            // console.log('posRightController.position', posRightController.position);
            this.drawObject.position.copy(posRightController);
            this.drawObject.quaternion.copy(event.data.context.oculusQuestModel.model.right.pose.orientation);
        });

        // this.actionController.on(ActionControllerEventName.buttonDown, this.drawPlane, () => {
        //     this.drawingMode = true;
        //     this.drawCanvasCTX.beginPath();
        //     this.orbitControls.enabled = false;
        // });
        // this.actionController.on(ActionControllerEventName.buttonUp, this.drawPlane, () => {
        //     this.drawingMode = false;
        //     this.orbitControls.enabled = true;
        // });

        let prevIntersectCenterX = 0;
        this.actionController.on(ActionControllerEventName.move, this.drawPlane, (event) => {
            if (!this.isPencilInHand) return;

            // this.drawObject.position.copy(event.data.intersection.point);

            const drawPlaneBox3 = new Box3().setFromObject(this.drawPlane);
            const drawObjectBox3 = new Box3().setFromObject(this.drawObject);
            const intersectPoint = drawPlaneBox3.clone().intersect(drawObjectBox3.clone()).getCenter(new Vector3());
            const localIntersectPoint = this.drawPlane.worldToLocal(intersectPoint.clone());

            console.log('intersectPoint', intersectPoint);

            if (prevIntersectCenterX === 0) this.drawCanvasCTX.beginPath();
            prevIntersectCenterX = intersectPoint.x;
            if (intersectPoint.x === 0) return;

            const canvasPoint = {
                x: localIntersectPoint.x + drawPlaneBox3.getSize(new Vector3()).x / 2,
                y: localIntersectPoint.y - drawPlaneBox3.getSize(new Vector3()).y / 2,
            };

            const canvasPositionPercent = {
                x: 100 / (drawPlaneBox3.getSize(new Vector3()).x / canvasPoint.x) / 100,
                y: 100 / (drawPlaneBox3.getSize(new Vector3()).y / canvasPoint.y) / 100,
            };

            // if (!this.drawingMode) return;

            // const drawPoint = {
            //     x: 512 * event.data.intersection.uv.x,
            //     y: 512 * (0.92 / 0.7) * (1 - event.data.intersection.uv.y),
            // };
            const drawPoint = {
                x: 512 * canvasPositionPercent.x,
                y: 512 * (0.92 / 0.7) * Math.abs(canvasPositionPercent.y),
            };

            const drawFunction = (isFirstPoint) ? 'moveTo' : 'lineTo';

            this.drawCanvasCTX[drawFunction](drawPoint.x, drawPoint.y);
            this.drawCanvasCTX.stroke();

            isFirstPoint = false;

            // @ts-ignore
            this.drawPlane.material.map.needsUpdate = true;
        });
    }

    initDrawPlane() {
        this.drawCanvas = document.createElement('canvas');
        this.drawCanvas.setAttribute('width', '512');
        this.drawCanvas.setAttribute('height', '' + (512 * (0.92 / 0.7)));
        this.drawCanvasCTX = this.drawCanvas.getContext('2d');
        this.drawCanvasCTX.lineWidth = 3;

        this.drawPlane = new Mesh(
            // new PlaneGeometry(0.7, 0.92),
            new BoxGeometry(0.7, 0.92, 0.01),
            new MeshBasicMaterial({map: new Texture(this.drawCanvas)})
        );
        this.drawPlane.name = 'drawPlane';
        this.drawPlane.position.set(0, 1.216, 0.067);
        this.scene.add(this.drawPlane);
    }

    setRaycastObject(object: Object3D) {
        this.drawObject = object;
    }

    setQuestModel(questModel: OculusQuestModel) {
        this.questModel = questModel;

        console.log('this.questModel', this.questModel);
    }

    setPickingController(pickingController: PickingController) {
        this.pickingController = pickingController;
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;

        this.initEvents();
    }

    setOrbitControls(orbitControls: OrbitControls) {
        this.orbitControls = orbitControls;
    }
}