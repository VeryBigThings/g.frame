// import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
// import {Raycaster, Vector3} from 'three';
// import {CameraControls} from '../../../g.frame.common.camera_controls/src';
// import {IOculusQuestActionControllerConfig} from './OculusQuestActionController';
//
// export interface IOculusQuestCameraControlsConfig {
//     minHorizontalMoveOffset: number;
//     maxHorizontalMoveOffset: number;
//     minVerticalMoveOffset: number;
//     maxVerticalMoveOffset: number;
// }
//
// export class OculusQuestCameraControls extends CameraControls {
//     protected onButtonDown: (event: any) => void;
//     protected onButtonUp: (event: any) => void;
//     protected onClick: (event: any) => void;
//     protected onMove: (event: any) => void;
//
//     /**
//      * Initialises Oculus Quest events for ActionController
//      * @param config Config for the class
//      * @param oculusQuestController Oculus Quest controller which fires the events
//      */
//     constructor(protected data: any, protected config: IOculusQuestCameraControlsConfig, protected oculusQuestModel: any) {
//         super();
//
//         // Check if they were undefined
//         this.config.minHorizontalMoveOffset = this.config.minHorizontalMoveOffset || 0;
//         this.config.maxHorizontalMoveOffset = this.config.maxHorizontalMoveOffset || Infinity;
//         this.config.minVerticalMoveOffset = this.config.minVerticalMoveOffset || 0;
//         this.config.maxVerticalMoveOffset = this.config.maxVerticalMoveOffset || Infinity;
//
//         // Subscribe on events
//         this.oculusQuestModel.on('buttonDown', this.onButtonDown);
//         this.oculusQuestModel.on('buttonUp', this.onButtonUp);
//         this.oculusQuestModel.on('click', this.onClick);
//         this.oculusQuestModel.on('move', this.onMove);
//     }
//
//     /**
//      * Function to unsubscribe OculusQuestActionController from all of the listened events
//      */
//     dispose() {
//         this.oculusQuestModel.off('buttonDown', this.onButtonDown);
//         this.oculusQuestModel.off('buttonUp', this.onButtonUp);
//         this.oculusQuestModel.off('click', this.onClick);
//         this.oculusQuestModel.off('move', this.onMove);
//     }
// }

import {IOculusQuestControllersModel} from '../OculusQuestModel';
import {EventDispatcher} from '@verybigthings/g.frame.core';
import {CircleGeometry, CylinderGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3} from 'three';
import {OculusQuestActionController} from './OculusQuestActionController';
import {ActionControllerEvent, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';

export class Teleport extends EventDispatcher<ActionControllerEventName> {
    constructor(public actionController: OculusQuestActionController, public cameraWrap: Object3D, public container: Object3D) {
        super();
        this.initEvents();
    }

    initEvents() {
        this.actionController.on(ActionControllerEventName.move, null, (event) => this.moveCamera(event.data.context.oculusQuestModel.model));
    }

    moveCamera(model: IOculusQuestControllersModel) {
        if (model.left.enabled) {
            // console.log('model', model.right.stick.axes);
            if (model.left.stick.axes.z !== 0 || model.left.stick.axes.w !== 0) {
                if (model.left.stick.pressed) {
                    this.cameraWrap.position.add(new Vector3(0.075 * model.left.stick.axes.z, 0, 0.075 * model.left.stick.axes.w));
                } else {
                    this.cameraWrap.position.add(new Vector3(0.05 * model.left.stick.axes.z, 0, 0.05 * model.left.stick.axes.w));
                }
                this.container.position.copy(this.cameraWrap.position);
            }
        } else if (model.right.enabled) {
            if (model.right.stick.axes.z !== 0 || model.right.stick.axes.w !== 0) {
                if (model.right.stick.pressed) {
                    this.cameraWrap.position.add(new Vector3(0.075 * model.right.stick.axes.z, 0, 0.075 * model.right.stick.axes.w));
                } else {
                    this.cameraWrap.position.add(new Vector3(0.05 * model.right.stick.axes.z, 0, 0.05 * model.right.stick.axes.w));
                }
                this.container.position.copy(this.cameraWrap.position);
            }
        }
    }
}

export class Locomotion extends EventDispatcher<ActionControllerEventName> {
// export class Teleport extends EventDispatcher<ActionControllerEventName> {

    public waypoint: Waypoint;
    public maxTeleportDistance: number = 2;

    constructor(public actionController: OculusQuestActionController, public cameraWrap: Object3D, public container: Object3D) {
        super();
        // this.initEvents();

        this.waypoint = new Waypoint();
        this.actionController.on(ActionControllerEventName.click, this.waypoint.container, (event)=> this.onClick(event))
    }

    addNavigationMesh(mesh: Object3D) {
        console.log('nav mesh added');
        this.actionController.on(ActionControllerEventName.move, mesh, (event) => this.onMove(event));
    }

    onClick(event: ActionControllerEvent) {
        const clickLocation = event.data.intersection.point;
        console.log('teleported to', event);
        this.cameraWrap.position.setX(clickLocation.x);
        this.cameraWrap.position.setZ(clickLocation.z);
        this.container.position.copy(this.cameraWrap.position);
    }

    onMove(event: ActionControllerEvent) {
        // @ts-ignore
        if (event.data.context.oculusQuestModel) {

            // @ts-ignore
            const model = event.data.context.oculusQuestModel.model;
            if (model.left.enabled) {
                if (+Number(model.left.stick.axes.z).toFixed(3) !== 0 || +Number(model.left.stick.axes.w).toFixed(3) !== 0) {
                    // dead zone added
                    // console.log('stick tilted enough', event);

                    if (this.checkTeleportAbility(event, 0)) {
                        this.waypoint.container.position.copy(event.data.intersection.point);
                        this.waypoint.start();
                    } else {
                        this.waypoint.stop();
                    }
                } else {
                    this.waypoint.stop();
                }
            } else if (model.right.enabled) {

            }
        } else {
            this.waypoint.stop();
        }
    }

    checkTeleportAbility(event: ActionControllerEvent, controllerNumber: number = 0): boolean {
        if (event.data.controllerNumber !== controllerNumber) return false;
        if (!event.data.intersection) return false;
        if (!event.data.intersection.object) return false;
        if (event.data.intersection.point.distanceTo(this.container.position) < this.maxTeleportDistance)
        return event.data.intersection.object.userData.navMesh;
    }
}

class Waypoint {
    readonly background: Mesh;
    readonly border: Mesh;
    readonly container: Object3D;
    private interval: any;
    private speed: number;


    constructor(componentRadius: number = .2, componentHeight: number = .1, speed: number = 40) {
        this.speed = speed;
        this.container = new Object3D();
        let clickableBack = new Mesh(new CircleGeometry(componentRadius, 16), new MeshBasicMaterial({visible: false}));
        clickableBack.rotation.set(-Math.PI / 2, 0, 0);
        this.container.add(clickableBack);

        this.background = new Mesh(new CircleGeometry(componentRadius, 32), new MeshBasicMaterial({
            color: 'red',
            // color: 'white',
            opacity: 0.7,
            transparent: true,
            side: 2
        }));
        this.background.position.set(0, 0, -0.01);
        this.background.rotation.set(-Math.PI / 2, 0, 0);
        this.container.add(this.background);
        this.border = new Mesh(new CylinderGeometry(componentRadius, componentRadius, componentHeight, 32, 1, true), new MeshBasicMaterial({
            color: 'red',
            // color: 'white',
            opacity: 0.7,
            transparent: true,
            side: 2
        }));
        this.border.position.set(0, -componentHeight / 2 - 0.01, -0.02);
        this.border.geometry.translate(0, componentHeight, 0);
        this.container.add(this.border);
        this.container.visible = false;
    }

    animate() {
        this.background.scale.setScalar(0.1);

        this.interval = setInterval(() => {
            if (this.background.scale.x > .99) {
                this.background.scale.setScalar(0.1);
            } else {
                this.background.scale.addScalar(0.05);
            }
            (<any>this.background.material).opacity = 1 - this.background.scale.x;
        }, this.speed);
    }

    stop() {
        this.interval && clearInterval(this.interval);
        this.interval = null;
        this.background.scale.set(1, 1, 1);
        this.container.visible = false;
    }

    start() {
        if (!this.interval) {
            this.container.visible = true;
            this.animate();
        }
    }
}