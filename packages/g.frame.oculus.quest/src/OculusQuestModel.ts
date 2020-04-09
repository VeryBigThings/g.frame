import {EventDispatcher, ParentEvent} from '@verybigthings/g.frame.core';
import {Matrix4, Mesh, Object3D, Quaternion, Vector3, Vector4} from 'three';
import {VRControlsEvent} from './OculusQuestControllers/VRControlsEvent';
import {IOculusQuestView} from './OculusQuestView';
import {Pointer} from './OculusQuestControllers/Pointer';
import {ControllerHandnessCodes} from '@verybigthings/g.frame.common.xr_manager/build/main/interfaces';

const config = {
    0: 'trigger',
    1: 'squeeze',
    2: 'touchpad',
    3: 'stick',
    4: 'botBtn',
    5: 'topBtn',
};

interface IOculusQuestControllerModel {
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

interface IOculusQuestControllersModel {
    left: IOculusQuestControllerModel;
    right: IOculusQuestControllerModel;
}

type XRFrame = any;

export class OculusQuestModel extends EventDispatcher<string> {
    public mainContainer: Object3D;

    private readonly model: IOculusQuestControllersModel;
    private currentOculusQuestView: IOculusQuestView;
    private pointerLeft: Pointer;
    private pointerRight: Pointer;
    private pointerWrapperLeft: Object3D;
    private pointerWrapperRight: Object3D;

    constructor(private data: any) {
        super();

        this.mainContainer = new Object3D();
        this.mainContainer.name = 'View&PointersContainer';

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

    updateView(newOculusQuestView: IOculusQuestView | null) {
        this.currentOculusQuestView?.uiObject?.parent?.remove(this.currentOculusQuestView.uiObject);
        this.currentOculusQuestView = newOculusQuestView;
        this.mainContainer.add(this.currentOculusQuestView?.uiObject);
    }

    /**
     * Updates the Model and sends it to the current View
     * @param frame XRFrame
     */
    manipulateModel(inputSourceLeft, inputSourceRight, frame: XRFrame) {
        this.model.left.enabled = false;
        this.model.right.enabled = false;

        if (inputSourceLeft && frame) {
            this.model.left.enabled = true;
            const gamepad = inputSourceLeft.gamepad;

            this.updatePose(frame, this.model.left, this.pointerLeft.uiObject, this.pointerWrapperLeft, inputSourceLeft);
            this.updateEvents(gamepad, this.model.left, this.pointerLeft.uiObject, this.pointerWrapperLeft, ControllerHandnessCodes.LEFT);
            this.updateModel(gamepad, this.model.left);
        } else {
            this.currentOculusQuestView?.hideView(ControllerHandnessCodes.LEFT);
        }

        if (inputSourceRight && frame) {
            this.model.right.enabled = true;
            const gamepad = inputSourceRight.gamepad;

            this.updatePose(frame, this.model.right, this.pointerRight.uiObject, this.pointerWrapperRight, inputSourceRight);
            this.updateEvents(gamepad, this.model.right, this.pointerRight.uiObject, this.pointerWrapperRight, ControllerHandnessCodes.RIGHT);
            this.updateModel(gamepad, this.model.right);
        } else {
            this.currentOculusQuestView?.hideView(ControllerHandnessCodes.RIGHT);
        }

        this.fire('controllerChange', new ParentEvent('controllerChange', this.model));
        this.currentOculusQuestView?.updateView(this.model);
    }

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

    /**
     * Function to add Pointers in 3d space
     */
    private setPointers() {
        // Left pointer
        this.pointerWrapperLeft = new Object3D();
        this.pointerWrapperLeft.name = 'LeftPointerWrapper';
        this.pointerLeft = new Pointer(this.data.viewer.scene, {color: 0xff2222}, this.data.viewer.camera);
        this.pointerLeft.uiObject.position.set(-0.0095, -0.00151, -5);
        this.pointerLeft.uiObject.rotation.set(0, Math.PI, 0);
        this.pointerWrapperLeft.add(this.pointerLeft.uiObject);

        // Right pointer
        this.pointerWrapperRight = new Object3D();
        this.pointerWrapperLeft.name = 'RightPointerWrapper';
        this.pointerRight = new Pointer(this.data.viewer.scene, {color: 0x2222ff}, this.data.viewer.camera);
        this.pointerRight.uiObject.position.set(0.0095, -0.00151, -5);
        this.pointerRight.uiObject.rotation.set(0, Math.PI, 0);
        this.pointerWrapperRight.add(this.pointerRight.uiObject);

        this.mainContainer.add(this.pointerWrapperLeft, this.pointerWrapperRight);
    }

    /**
     * Updates position and orientation of the pointers
     * @param frame XRFrame
     * @param model Gamepad's model which data should be updated
     */
    private updatePose(frame: XRFrame, model: IOculusQuestControllerModel, pointer, wrapper, inputSource) {
        const inputPose = frame.getPose(inputSource.targetRaySpace, this.data.viewer.renderer.xr.getReferenceSpace());
        new Matrix4().fromArray(inputPose.transform.matrix).decompose(model.pose.position, model.pose.orientation, new Vector3());
        new Matrix4().fromArray(inputPose.transform.matrix).decompose(wrapper.position, wrapper.quaternion, new Vector3());

        pointer.updateMatrixWorld(true);
        this.mainContainer.updateMatrixWorld(true);
    }

    /**
     * Updates custom events
     * @param gamepad Data with current gamepad's states
     * @param model Gamepad's model which data should be updated
     * @param pointer Needs to calculate the direction of the ray for the raycaster
     * @param wrapper Actually the start point of the ray for the raycaster
     * @param code Needs to understand which controller is firing the events
     */
    private updateEvents(gamepad, model: IOculusQuestControllerModel, pointer: Object3D, wrapper: Object3D, code: number) {
        const newButtonDown = gamepad.buttons[0].pressed;

        this.fire('move', new ParentEvent<string>('move', this.getEventData(wrapper, pointer, code)));
        if (!model.trigger.pressed && newButtonDown) {
            this.fire('buttonDown', new ParentEvent<string>('buttonDown', this.getEventData(wrapper, pointer, code)));
        }
        if (model.trigger.pressed && !newButtonDown) {
            this.fire('buttonUp', new ParentEvent<string>('buttonUp', this.getEventData(wrapper, pointer, code)));
            this.fire('click', new ParentEvent<string>('click', this.getEventData(wrapper, pointer, code)));
        }
        model.trigger.pressed = newButtonDown;
    }

    /**
     * Updates data of the gamepad's model
     * @param gamepad Data with current gamepad's states
     * @param model Gamepad's model which data should be updated
     */
    private updateModel(gamepad, model: IOculusQuestControllerModel) {
        model.stick.axes = new Vector4(gamepad.axes[0], gamepad.axes[1], gamepad.axes[2], gamepad.axes[3]);
        model.trigger.value = gamepad.buttons[0].value;
        model.squeeze.value = gamepad.buttons[1].value;
        gamepad.buttons.forEach((el: GamepadButton, index: number) => {
            model[config[index]] && (model[config[index]].touched = el.touched);
            model[config[index]] && (model[config[index]].pressed = el.pressed);
            model[config[index]] && (model[config[index]].value = el.value);
        });
    }

    private getEventData(uiObject: Object3D, controller: Object3D, code: number): VRControlsEvent {
        return new VRControlsEvent('createdEvent', uiObject.localToWorld(new Vector3()), controller.localToWorld(new Vector3()), code);
    }
}