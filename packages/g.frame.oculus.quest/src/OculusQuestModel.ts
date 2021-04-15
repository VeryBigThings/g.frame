import { ControllerHandnessCodes, IXRControllerModel, IXRControllerView, XRControllerModelEvents } from '@verybigthings/g.frame.common.xr_manager';
import { EventDispatcher, ParentEvent } from '@verybigthings/g.frame.core';
import { Matrix4, Mesh, Object3D, Quaternion, Vector3, Vector4 } from 'three';
import { VRControlsEvent } from './OculusQuestControllers/VRControlsEvent';
import { Pointer } from './OculusQuestControllers/Pointer';

const config = {
    0: 'trigger',
    1: 'squeeze',
    2: 'touchpad',
    3: 'stick',
    4: 'botBtn',
    5: 'topBtn',
};

/**
 * TO DO: Describe XRFrame
 */
type XRFrame = any;

export interface IOculusQuestControllersModel {
    left: IOculusQuestControllerModel;
    right: IOculusQuestControllerModel;
}

export interface IOculusQuestControllerModel {
    enabled: boolean;
    pose: {
        position: Vector3;
        orientation: Quaternion;
    };
    trigger: {
        touched: boolean;
        clicked: boolean;
        pressed: boolean;
        value: number;
    };
    squeeze: {
        touched: boolean;
        clicked: boolean;
        pressed: boolean;
        value: number;
    };
    stick: {
        axes: Vector4;
        touched: boolean;
        clicked: boolean;
        pressed: boolean;
    };
    topBtn: {
        touched: boolean;
        clicked: boolean;
        pressed: boolean;
    };
    botBtn: {
        touched: boolean;
        clicked: boolean;
        pressed: boolean;
    };
}

export class OculusQuestModel extends EventDispatcher<XRControllerModelEvents> implements IXRControllerModel {
    public mainContainer: Object3D;

    public model: IOculusQuestControllersModel;
    private currentOculusQuestView: IXRControllerView;

    private pointerLeft: Pointer;
    private pointerRight: Pointer;
    private pointerWrapperLeft: Object3D;
    private pointerWrapperRight: Object3D;

    private frame: XRFrame;
    private inputSourceLeft: any;
    private inputSourceRight: any;

    constructor(private data: any) {
        super();

        this.mainContainer = new Object3D();
        this.mainContainer.name = 'View&PointersContainer';

        // Init the model
        this.model = {
            left: {
                enabled: false,
                pose: {
                    position: new Vector3(),
                    orientation: new Quaternion(),
                },
                trigger: {
                    touched: false,
                    clicked: false,
                    pressed: false,
                    value: 0,
                },
                squeeze: {
                    touched: false,
                    clicked: false,
                    pressed: false,
                    value: 0,
                },
                stick: {
                    axes: new Vector4(),
                    touched: false,
                    clicked: false,
                    pressed: false,
                },
                topBtn: {
                    touched: false,
                    clicked: false,
                    pressed: false,
                },
                botBtn: {
                    touched: false,
                    clicked: false,
                    pressed: false,
                },
            },

            right: {
                enabled: false,
                pose: {
                    position: new Vector3(),
                    orientation: new Quaternion(),
                },
                trigger: {
                    touched: false,
                    clicked: false,
                    pressed: false,
                    value: 0,
                },
                squeeze: {
                    touched: false,
                    clicked: false,
                    pressed: false,
                    value: 0,
                },
                stick: {
                    axes: new Vector4(),
                    touched: false,
                    clicked: false,
                    pressed: false,
                },
                topBtn: {
                    touched: false,
                    clicked: false,
                    pressed: false,
                },
                botBtn: {
                    touched: false,
                    clicked: false,
                    pressed: false,
                },
            }
        };
        this.setPointers();
    }

    /**
     * Removes current and adds new Oculus Quest controllers view to the container
     * @param newOculusGoView This view will replace current Oculus Quest view itself
     */
    updateView(newOculusQuestView: IXRControllerView | null) {
        this.currentOculusQuestView?.uiObject?.parent?.remove(this.currentOculusQuestView.uiObject);
        this.currentOculusQuestView = newOculusQuestView;
        this.mainContainer.add(this.currentOculusQuestView?.uiObject);
    }

    /**
     * Updates state of the model. Updates current Oculus Quest controllers view
     * @param inputSourceLeft Current input source from left controller
     * @param inputSourceRight Current input source from right controller
     * @param frame Current frame
     */
    manipulateModel(inputSourceLeft, inputSourceRight, frame: XRFrame) {
        this.model.left.enabled = false;
        this.model.right.enabled = false;
        this.frame = frame;
        this.inputSourceLeft = inputSourceLeft;
        this.inputSourceRight = inputSourceRight;

        if (this.inputSourceLeft && this.frame) {
            this.model.left.enabled = true;

            this.updatePose(ControllerHandnessCodes.LEFT);
            this.updateEvents(ControllerHandnessCodes.LEFT);
            this.updateModel(ControllerHandnessCodes.LEFT);
        } else {
            this.currentOculusQuestView?.hideView(ControllerHandnessCodes.LEFT);
        }

        if (this.inputSourceRight && this.frame) {
            this.model.right.enabled = true;

            this.updatePose(ControllerHandnessCodes.RIGHT);
            this.updateEvents(ControllerHandnessCodes.RIGHT);
            this.updateModel(ControllerHandnessCodes.RIGHT);
        } else {
            this.currentOculusQuestView?.hideView(ControllerHandnessCodes.RIGHT);
        }

        this.fire(XRControllerModelEvents.controllerChanged, new ParentEvent(XRControllerModelEvents.controllerChanged, this.model));
        this.currentOculusQuestView?.updateView(this);
    }

    /**
     * Updates position and orientation of a controller and pointer
     * @param code Defines which controller will be updated
     */
    private updatePose(code: number) {
        let model: IOculusQuestControllerModel, inputSource: any, pointer: Object3D, pointerWrapper: Object3D;

        if (code === ControllerHandnessCodes.LEFT) {
            model = this.model.left;
            inputSource = this.inputSourceLeft;
            pointer = this.pointerLeft.uiObject;
            pointerWrapper = this.pointerWrapperLeft;
        } else if (code === ControllerHandnessCodes.RIGHT) {
            model = this.model.right;
            inputSource = this.inputSourceRight;
            pointer = this.pointerRight.uiObject;
            pointerWrapper = this.pointerWrapperRight;
        } else {
            return;
        }

        const inputPose = this.frame.getPose(inputSource.targetRaySpace, this.data.viewer.renderer.xr.getReferenceSpace());
        if (inputPose) {
            new Matrix4().fromArray(inputPose.transform.matrix).decompose(model.pose.position, model.pose.orientation, new Vector3());
            new Matrix4().fromArray(inputPose.transform.matrix).decompose(pointerWrapper.position, pointerWrapper.quaternion, new Vector3());

            pointer.updateMatrixWorld(true);
            this.mainContainer.updateMatrixWorld(true);
        }
    }

    /**
     * Checks and fires custom events
     * @param code Defines which controller will be checked
     */
    private updateEvents(code: number) {
        let model: IOculusQuestControllerModel, inputSource: any;

        if (code === ControllerHandnessCodes.LEFT) {
            model = this.model.left;
            inputSource = this.inputSourceLeft;
        } else if (code === ControllerHandnessCodes.RIGHT) {
            model = this.model.right;
            inputSource = this.inputSourceRight;
        } else {
            return;
        }

        const newButtonDown = inputSource.gamepad.buttons[0].pressed;

        this.fire(XRControllerModelEvents.move, new ParentEvent(XRControllerModelEvents.move, this.getEventData(code)));
        if (!model.trigger.pressed && newButtonDown) {
            this.fire(XRControllerModelEvents.buttonDown, new ParentEvent(XRControllerModelEvents.buttonDown, this.getEventData(code)));
        }
        if (model.trigger.pressed && !newButtonDown) {
            this.fire(XRControllerModelEvents.buttonUp, new ParentEvent(XRControllerModelEvents.buttonUp, this.getEventData(code)));
            this.fire(XRControllerModelEvents.click, new ParentEvent(XRControllerModelEvents.click, this.getEventData(code)));
        }
        model.trigger.pressed = newButtonDown;
    }

    /**
     * Updates states of the buttons
     * @param code Defines which model will be updated
     */
    private updateModel(code: number) {
        let model: IOculusQuestControllerModel, gamepad: any;

        if (code === ControllerHandnessCodes.LEFT) {
            model = this.model.left;
            gamepad = this.inputSourceLeft.gamepad;
        } else if (code === ControllerHandnessCodes.RIGHT) {
            model = this.model.right;
            gamepad = this.inputSourceRight.gamepad;
        } else {
            return;
        }

        model.stick.axes = new Vector4(gamepad.axes[0], gamepad.axes[1], gamepad.axes[2], gamepad.axes[3]);
        model.trigger.value = gamepad.buttons[0].value;
        model.squeeze.value = gamepad.buttons[1].value;
        gamepad.buttons.forEach((el: GamepadButton, index: number) => {
            model[config[index]] && (model[config[index]].touched = el.touched);
            model[config[index]] && (model[config[index]].pressed = el.pressed);
            model[config[index]] && (model[config[index]].value = el.value);
        });
    }

    /**
     * Adds pointers into container to help aim
     */
    private setPointers() {
        // Left pointer
        this.pointerWrapperLeft = new Object3D();
        this.pointerWrapperLeft.name = 'LeftPointerWrapper';
        this.pointerLeft = new Pointer(this.data.viewer.scene, { color: 0xff2222 }, this.data.viewer.camera);
        this.pointerLeft.uiObject.position.set(-0.0095, -0.00151, -5);
        this.pointerLeft.uiObject.rotation.set(0, Math.PI, 0);
        this.pointerWrapperLeft.add(this.pointerLeft.uiObject);

        // Right pointer
        this.pointerWrapperRight = new Object3D();
        this.pointerWrapperLeft.name = 'RightPointerWrapper';
        this.pointerRight = new Pointer(this.data.viewer.scene, { color: 0x2222ff }, this.data.viewer.camera);
        this.pointerRight.uiObject.position.set(0.0095, -0.00151, -5);
        this.pointerRight.uiObject.rotation.set(0, Math.PI, 0);
        this.pointerWrapperRight.add(this.pointerRight.uiObject);

        this.mainContainer.add(this.pointerWrapperLeft, this.pointerWrapperRight);
    }

    /**
     * Returns a direction of the aiming
     * @param code Defines which pointer will be used
     */
    private getEventData(code: number): VRControlsEvent {
        let pointer: Object3D, pointerWrapper: Object3D;

        if (code === ControllerHandnessCodes.LEFT) {
            pointer = this.pointerLeft.uiObject;
            pointerWrapper = this.pointerWrapperLeft;
        } else if (code === ControllerHandnessCodes.RIGHT) {
            pointer = this.pointerRight.uiObject;
            pointerWrapper = this.pointerWrapperRight;
        } else {
            return;
        }

        return new VRControlsEvent('createdEvent', pointerWrapper.localToWorld(new Vector3()), pointer.localToWorld(new Vector3()), code);
    }

    public vibrate(duration: number = 500, controllerName: 'both' | 'left' | 'right' = 'both', power: number = 1, delay: number = 0) {
        if (duration + delay > 5000) {
            console.error('The delay and duration of vibration should not exceed 5000ms');
            return;
        }

        if (this.inputSourceRight && ['both', 'right'].includes(controllerName)) {
            // @ts-ignore
            this.inputSourceRight.gamepad.vibrationActuator.playEffect('dual-rumble', {
                startDelay: delay, // Add a delay in milliseconds
                duration: duration, // Total duration in milliseconds
                weakMagnitude: power, // intensity (0-1) of the small ERM
                strongMagnitude: power // intesity (0-1) of the bigger ERM
            })
                .then(() => {
                    this.fire(XRControllerModelEvents.vibrationEnd, new ParentEvent(XRControllerModelEvents.vibrationEnd, this.getEventData(ControllerHandnessCodes.RIGHT)));
                });

            setTimeout(() => {
                this.fire(XRControllerModelEvents.vibrationStart, new ParentEvent(XRControllerModelEvents.vibrationStart, this.getEventData(ControllerHandnessCodes.RIGHT)));
            }, delay);
        }

        if (this.inputSourceLeft && ['both', 'left'].includes(controllerName)) {
            // @ts-ignore
            this.inputSourceLeft.gamepad.vibrationActuator.playEffect('dual-rumble', {
                startDelay: delay, // Add a delay in milliseconds
                duration: duration, // Total duration in milliseconds
                weakMagnitude: power, // intensity (0-1) of the small ERM
                strongMagnitude: power // intesity (0-1) of the bigger ERM
            })
                .then(() => {
                    this.fire(XRControllerModelEvents.vibrationEnd, new ParentEvent(XRControllerModelEvents.vibrationEnd, this.getEventData(ControllerHandnessCodes.LEFT)));
                });

            setTimeout(() => {
                this.fire(XRControllerModelEvents.vibrationStart, new ParentEvent(XRControllerModelEvents.vibrationStart, this.getEventData(ControllerHandnessCodes.LEFT)));
            }, delay);
        }
    }

    /**
     * Removes pointers
     */
    dispose(code: number) {
        if (code === ControllerHandnessCodes.LEFT) {
            (<Mesh>this.pointerLeft.uiObject).material['dispose']();
            (<Mesh>this.pointerLeft.uiObject).geometry.dispose();
            this.pointerWrapperLeft = null;
        }

        if (code === ControllerHandnessCodes.RIGHT) {
            (<Mesh>this.pointerRight.uiObject).material['dispose']();
            (<Mesh>this.pointerRight.uiObject).geometry.dispose();
            this.pointerWrapperRight = null;
        }
    }
}
