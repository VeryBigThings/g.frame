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
import {Object3D, Vector3} from 'three';
import {OculusQuestActionController} from './OculusQuestActionController';
import {ActionControllerEvent, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';

export class Locomotion extends EventDispatcher<ActionControllerEventName> {
    constructor(public actionController: OculusQuestActionController, public camera: Object3D, public container: Object3D) {
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
                    this.camera.position.add(new Vector3(0.075 * model.left.stick.axes.z, 0, 0.075 * model.left.stick.axes.w));
                } else {
                    this.camera.position.add(new Vector3(0.05 * model.left.stick.axes.z, 0, 0.05 * model.left.stick.axes.w));
                }
                this.container.position.copy(this.camera.position);
            }
        } else if (model.right.enabled) {
            if (model.right.stick.axes.z !== 0 || model.right.stick.axes.w !== 0) {
                if (model.right.stick.pressed) {
                    this.camera.position.add(new Vector3(0.075 * model.right.stick.axes.z, 0, 0.075 * model.right.stick.axes.w));
                } else {
                    this.camera.position.add(new Vector3(0.05 * model.right.stick.axes.z, 0, 0.05 * model.right.stick.axes.w));
                }
                this.container.position.copy(this.camera.position);
            }
        }
    }
}

export class Teleport extends EventDispatcher<ActionControllerEventName> {
    constructor(public actionController: OculusQuestActionController, public cameraWrap: Object3D, public container: Object3D) {
        super();
        this.initEvents();
    }

    initEvents() {
        this.actionController.on(ActionControllerEventName.move, null, (event) => this.moveCamera(event));
    }

    moveCamera(event: ActionControllerEvent) {
        // @ts-ignore
        if (event.data.context.oculusQuestModel) {
            // @ts-ignore
            const model = event.data.context.oculusQuestModel.model;
            if (model.left.enabled) {
                // console.log('event point', event.data?.intersection[0]?.point);
                // console.log('event z stick fixed', +Number(model.left.stick.axes.z).toFixed(3));

                if (+Number(model.left.stick.axes.z).toFixed(3) !== 0 || +Number(model.left.stick.axes.w).toFixed(3) !== 0) {
                    // dead zone added
                    if (this.checkTeleportAbility(event)) {
                        console.log('event point', event.data.intersection[0].point);
                    }
                } else if (model.right.enabled) {

                }
            }

        }
    }

    checkTeleportAbility(event: ActionControllerEvent): boolean {
        if (!event.data.intersection) return false;
        if (!event.data.intersection[0]) return false;
        // return event.data.intersection[0].object.userData.navMesh;
        return true;
    }
}