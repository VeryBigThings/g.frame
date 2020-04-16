import {XRViewStatus, ControllerHandnessCodes, IXRControllerModel, IXRControllerView} from '@verybigthings/g.frame.common.xr_manager';
import {FBX_MODEL, Loader} from '@verybigthings/g.frame.common.loaders';
import {ViewerModule} from '@verybigthings/g.frame.core';
import {ConeBufferGeometry, Group, Mesh, MeshBasicMaterial, Object3D, Vector3} from 'three';

export default class QuestHandView extends ViewerModule implements IXRControllerView {
    private _status: XRViewStatus = XRViewStatus.PREPARING;
    private loader: Loader<any>;
    private controllerLeft: Object3D;
    private controllerRight: Object3D;
    private controllerLeftWrapper: Group;
    private controllerRightWrapper: Group;
    private leftTriggerFinger: Object3D;
    private rightTriggerFinger: Object3D;
    private triggerFingersStartingRotations: Array<{ name: string, rotation: Vector3 }>;
    private triggerFingersClosedRotations: Array<{ name: string, rotation: Vector3 }>;
    private triggerFingersPreClosedRotations: Array<{ name: string, rotation: Vector3 }>;
    private leftThumbFinger: Object3D;
    private rightThumbFinger: Object3D;
    private thumbFingersStartingRotations: Array<{ name: string, rotation: Vector3 }>;
    private thumbFingersClosedRotations: Array<{ name: string, rotation: Vector3 }>;
    private leftSqueezeFingers: Array<Object3D>;
    private rightSqueezeFingers: Array<Object3D>;
    private squeezeFingersStartingRotations: Array<{ name: string, rotation: Vector3 }>;
    private squeezeFingersClosedRotations: Array<{ name: string, rotation: Vector3 }>;
    private squeezeFingersPreClosedRotations: Array<{ name: string, rotation: Vector3 }>;

    constructor(private scene: Object3D) {
        super();
    }

    getStatus() {
        return this._status;
    }

    prepareResources(loader: Loader<any>) {
        this.loader = loader;
        this.loader.addResources([
            {
                name: 'left_quest_hand',
                url: require('./assets/models/left_quest_hand.fbx'),
                type: FBX_MODEL
            },
            {
                name: 'right_quest_hand',
                url: require('./assets/models/left_quest_hand.fbx'),
                type: FBX_MODEL
            },
        ]);


        this.loader.once('loaded', () => this.init());
    }

    init() {
        this._status = XRViewStatus.READY;

        // const material = controller;
        this.controllerLeft = this.loader.getResource<Object3D>('left_quest_hand');
        this.controllerLeft.scale.set(0.01, 0.01, 0.01);

        this.controllerLeft.rotation.set(0, Math.PI, Math.PI / -2);

        this.controllerRight = this.loader.getResource<Object3D>('right_quest_hand');
        this.controllerRight.userData = {};
        this.controllerRight.rotation.set(0, Math.PI, Math.PI / 2);
        // this.controllerRight.material = this.controllerRight.children[0].children[0].material;
        this.controllerRight.scale.set(-0.01, 0.01, 0.01);

        // Rays
        // this.controllerLightLeft = new GMesh<ConeBufferGeometry, MeshBasicMaterial>(new ConeBufferGeometry(0.003, 1.5, 16), new MeshBasicMaterial({color: 'blue'}));
        // this.controllerLightLeft.position.set(0.04, 0.05, .85);
        // this.controllerLightLeft.rotateX(Math.PI / 2);
        // this.controllerLightRight = new GMesh<ConeBufferGeometry, MeshBasicMaterial>(new ConeBufferGeometry(0.003, 1.5, 16), new MeshBasicMaterial({color: 'red'}));
        // this.controllerLightRight.position.set(-0.04, 0.05, .85);
        // this.controllerLightRight.rotateX(Math.PI / 2);

        this.controllerLeftWrapper = new Group();
        this.controllerLeftWrapper.name = 'Controller Left Wrapper';
        this.controllerLeftWrapper.add(this.controllerLeft);
        // this.controllerLeftWrapper.add(this.controllerLightLeft);


        this.controllerRightWrapper = new Group();
        this.controllerRightWrapper.name = 'Controller Right Wrapper';
        this.controllerRightWrapper.add(this.controllerRight);
        // this.controllerRightWrapper.add(this.controllerLightRight);

        // Fingers

        this.leftThumbFinger = this.controllerLeft.getObjectByName('handsb_l_thumb1');
        this.leftTriggerFinger = this.controllerLeft.getObjectByName('handsb_l_index1');
        this.leftSqueezeFingers = [this.controllerLeft.getObjectByName('handsb_l_pinky0'), this.controllerLeft.getObjectByName('handsb_l_ring1'), this.controllerLeft.getObjectByName('handsb_l_middle1')];
        this.controllerLeft.userData = {
            squeeze: this.leftSqueezeFingers,
            trigger: this.leftTriggerFinger,
            thumb: this.leftThumbFinger
        };

        this.rightThumbFinger = this.controllerRight.getObjectByName('handsb_l_thumb1');
        this.rightTriggerFinger = this.controllerRight.getObjectByName('handsb_l_index1');
        this.rightSqueezeFingers = [this.controllerRight.getObjectByName('handsb_l_pinky0'), this.controllerRight.getObjectByName('handsb_l_ring1'), this.controllerRight.getObjectByName('handsb_l_middle1')];
        this.controllerRight.userData = {
            squeeze: this.rightSqueezeFingers,
            trigger: this.rightTriggerFinger,
            thumb: this.rightThumbFinger
        };

        this.triggerFingersStartingRotations = [];
        this.leftTriggerFinger.traverse((obj) => {
            this.triggerFingersStartingRotations.push({
                name: obj.name,
                rotation: new Vector3().copy(obj.rotation.toVector3())
            });
        });
        this.triggerFingersClosedRotations = [
            {
                name: 'handsb_l_index1',
                rotation: new Vector3(-1.65, -.25, -1.85)
            },
            {
                name: 'handsb_l_index2',
                rotation: new Vector3(0, 0, 1.85)
            },
            {
                name: 'handsb_l_index3',
                rotation: new Vector3(0, 0, 1.76)
            }
        ];
        this.triggerFingersPreClosedRotations = [
            {
                name: 'handsb_l_index1',
                rotation: new Vector3(-1.65, -.25, -2.62)
            },
            {
                name: 'handsb_l_index2',
                rotation: new Vector3(0, 0, .82)
            },
            {
                name: 'handsb_l_index3',
                rotation: new Vector3(0, 0, .61)
            }
        ];

        this.thumbFingersStartingRotations = [];
        this.leftThumbFinger.traverse((obj) => {
            this.thumbFingersStartingRotations.push({
                name: obj.name,
                rotation: new Vector3().copy(obj.rotation.toVector3())
            });
        });
        this.thumbFingersClosedRotations = [
            {
                name: 'handsb_l_thumb1',
                rotation: new Vector3(2.96, -.52, 2.86)
            },
            {
                name: 'handsb_l_thumb2',
                rotation: new Vector3(0, 0, .53)
            },
            {
                name: 'handsb_l_thumb3',
                rotation: new Vector3(0, 0, 1.04)
            }
        ];

        this.squeezeFingersStartingRotations = [];
        this.leftSqueezeFingers.forEach(finger => finger.traverse((obj) => {
            this.squeezeFingersStartingRotations.push({
                name: obj.name,
                rotation: new Vector3().copy(obj.rotation.toVector3())
            });
        }));
        this.squeezeFingersClosedRotations = [
            {
                name: 'handsb_l_middle1',
                rotation: new Vector3(-1.41, -.05, -1.8)
            },
            {
                name: 'handsb_l_middle2',
                rotation: new Vector3(0, 0, 1.75)
            },
            {
                name: 'handsb_l_middle3',
                rotation: new Vector3(0, 0, 2.2)
            },
            {
                name: 'handsb_l_ring1',
                rotation: new Vector3(-1.23, .13, -1.85)
            },
            {
                name: 'handsb_l_ring2',
                rotation: new Vector3(0, 0, 2)
            },
            {
                name: 'handsb_l_ring3',
                rotation: new Vector3(0, 0, 2)
            },
            {
                name: 'handsb_l_pinky0',
                rotation: new Vector3(-.98, .23, -0.2)
            },
            {
                name: 'handsb_l_pinky1',
                rotation: new Vector3(-.02, 0.04, -1.69)
            },
            {
                name: 'handsb_l_pinky2',
                rotation: new Vector3(0, 0, 1.87)
            },
            {
                name: 'handsb_l_pinky3',
                rotation: new Vector3(0, 0, 1.75)
            }
        ];
        this.squeezeFingersPreClosedRotations = [
            {
                name: 'handsb_l_middle1',
                rotation: new Vector3(-1.41, -.05, -2.62)
            },
            {
                name: 'handsb_l_middle2',
                rotation: new Vector3(0, 0, .86)
            },
            {
                name: 'handsb_l_middle3',
                rotation: new Vector3(0, 0, .75)
            },
            {
                name: 'handsb_l_ring1',
                rotation: new Vector3(-1.23, .13, -2.64)
            },
            {
                name: 'handsb_l_ring2',
                rotation: new Vector3(0, 0, .89)
            },
            {
                name: 'handsb_l_ring3',
                rotation: new Vector3(0, 0, .72)
            },
            {
                name: 'handsb_l_pinky0',
                rotation: new Vector3(-.98, .23, -0.11)
            },
            {
                name: 'handsb_l_pinky1',
                rotation: new Vector3(-.02, 0.04, -2.54)
            },
            {
                name: 'handsb_l_pinky2',
                rotation: new Vector3(0, 0, .79)
            },
            {
                name: 'handsb_l_pinky3',
                rotation: new Vector3(0, 0, .59)
            }
        ];


        this.controllerLeftWrapper.traverse(el => {
            el.raycast = () => {};
        });
        this.controllerRightWrapper.traverse(el => {
            el.raycast = () => {};
        });
        this.addObject(this.controllerLeftWrapper);
        this.addObject(this.controllerRightWrapper);

        let rayLeft, rayRight;
        // Left ray
        rayLeft = new Mesh(new ConeBufferGeometry(0.0025, 1.5, 16), new MeshBasicMaterial({color: 'white'}));
        rayLeft.position.set(0, 0, -1.6);
        rayLeft.scale.set(1, 2, 1);
        rayLeft.rotation.set(-Math.PI / 2, 0, 0);
        this.addObject(rayLeft, null, this.controllerLeftWrapper);

        // Right ray
        rayRight = new Mesh(new ConeBufferGeometry(0.0025, 1.5, 16), new MeshBasicMaterial({color: 'white'}));
        rayRight.position.set(0, 0, -1.6);
        rayRight.scale.set(1, 2, 1);
        rayRight.rotation.set(-Math.PI / 2, 0, 0);
        this.addObject(rayRight, null, this.controllerRightWrapper);
    }

    updateView(viewModel: IXRControllerModel) {
        const model = viewModel.model;
        // Left
        if (model.left.enabled) {
            this.controllerLeftWrapper.visible = true;
            this.visualUpdate(model.left, this.controllerLeft, this.controllerLeftWrapper);
        }

        // Right
        if (model.right.enabled) {
            this.controllerRightWrapper.visible = true;
            this.visualUpdate(model.right, this.controllerRight, this.controllerRightWrapper);
        }
    }

    visualUpdate(view: any, controller: any, wrapper: Group) {
        // Model
        wrapper.position.copy(view.pose.position);
        wrapper.quaternion.copy(view.pose.orientation);

        // // Buttons
        // const stickLeft = controller.userData.stick;
        const trigger = controller.userData.trigger;

        if (view.trigger.pressed) {
            trigger.traverse((obj) => {
                this.triggerFingersClosedRotations.forEach((el) => {
                    if (el.name === obj.name) {
                        obj.rotation.setFromVector3(el.rotation);
                    }
                });
            });
            // } else if (view.trigger.touched) {
            //      trigger.traverse((obj) => {
            //          this.triggerFingersPreClosedRotations.forEach((el) => {
            //              if (el.name === obj.name) {
            //                  obj.rotation.setFromVector3(el.rotation);
            //              }
            //          });
            //      });
        } else if (view.trigger.value) {
            trigger.traverse((obj) => {
                this.triggerFingersClosedRotations.forEach((end) => {
                    if (end.name === obj.name) {
                        this.triggerFingersStartingRotations.forEach((start) => {
                            if (start.name === obj.name) {
                                obj.rotation.setFromVector3(start.rotation.clone().lerp(end.rotation.clone(), view.trigger.value));
                            }
                        });
                    }
                });
            });
        } else {
            trigger.traverse((obj) => {
                this.triggerFingersStartingRotations.forEach((el) => {
                    if (el.name === obj.name) {
                        obj.rotation.setFromVector3(el.rotation);
                    }
                });
            });
        }

        const squeeze = controller.userData.squeeze;

        if (view.squeeze.pressed) {
            squeeze.forEach(finger => finger.traverse((obj) => {
                this.squeezeFingersClosedRotations.forEach((el) => {
                    if (el.name === obj.name) {
                        obj.rotation.setFromVector3(el.rotation);
                    }
                });
            }));
            // } else if (view.squeeze.touched) {
            //     squeeze.forEach(finger => finger.traverse((obj) => {
            //         this.squeezeFingersPreClosedRotations.forEach((el) => {
            //             if (el.name === obj.name) {
            //                 obj.rotation.setFromVector3(el.rotation);
            //             }
            //         });
            //     }));
        } else if (view.squeeze.value) {
            squeeze.forEach(finger => finger.traverse((obj) => {
                this.squeezeFingersClosedRotations.forEach((end) => {
                    if (end.name === obj.name) {
                        this.squeezeFingersStartingRotations.forEach((start) => {
                            if (start.name === obj.name) {
                                obj.rotation.setFromVector3(start.rotation.clone().lerp(end.rotation.clone(), view.squeeze.value));
                            }
                        });
                    }
                });
            }));
        } else {
            squeeze.forEach(finger => finger.traverse((obj) => {
                this.squeezeFingersStartingRotations.forEach((el) => {
                    if (el.name === obj.name) {
                        obj.rotation.setFromVector3(el.rotation);
                    }
                });
            }));
        }

        const thumb = controller.userData.thumb;

        if (view.stick.touched || view.topBtn.touched || view.botBtn.touched) {
            thumb.traverse((obj) => {
                this.thumbFingersClosedRotations.forEach((el) => {
                    if (el.name === obj.name) {
                        obj.rotation.setFromVector3(el.rotation);
                    }
                });
            });
        } else {
            thumb.traverse((obj) => {
                this.thumbFingersStartingRotations.forEach((el) => {
                    if (el.name === obj.name) {
                        obj.rotation.setFromVector3(el.rotation);
                    }
                });
            });
        }
    }

    hideView(code: number) {
        if (code === ControllerHandnessCodes.LEFT && this.controllerLeftWrapper) this.controllerLeftWrapper.visible = false;
        if (code === ControllerHandnessCodes.RIGHT && this.controllerRightWrapper) this.controllerRightWrapper.visible = false;
    }
}
