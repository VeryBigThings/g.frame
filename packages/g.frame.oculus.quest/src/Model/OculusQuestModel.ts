import {ParentEvent, EventDispatcher} from '@verybigthings/g.frame.core';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {Matrix4, Mesh, Object3D, Quaternion, Vector3, Vector4} from 'three';
import {IOculusQuestView, OculusQuestView} from '../View/OculusQuestView';
import {CONTROLLER_HANDEDNESS_CODE} from '../Manager/OculusQuestManager';
import {VRControlsEvent} from '../QuestControllers/VRControlsEvent';
import {Pointer} from '../QuestControllers/Pointer';

const config = {
    0: 'trigger',
    1: 'squeeze',
    2: 'touchpad',
    3: 'stick',
    4: 'botBtn',
    5: 'topBtn',
};

type Model = any;

type XRFrame = any;

export class OculusQuestModel extends EventDispatcher<string> {
    public mainContainer: Object3D;

    private model: Model;
    private mainOculusQuestView: OculusQuestView;
    private currentOculusQuestView: IOculusQuestView;

    private pointerLeft: Pointer;
    private pointerRight: Pointer;
    private pointerWrapperLeft: Object3D;
    private pointerWrapperRight: Object3D;

    constructor(private data: any) {
        super();
        this.mainOculusQuestView = new OculusQuestView();
        this.currentOculusQuestView = this.mainOculusQuestView;

        this.mainContainer = new Object3D();
        this.mainContainer.name = 'OculusQuestView&PointersContainer';
        this.mainContainer.add(this.currentOculusQuestView.uiObject);

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
     * Function to manage and load view's assets
     * @param loader Loader
     */
    prepareResources(loader: Loader<any>) {
        this.mainOculusQuestView.prepareResources(loader);
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
     * Updates the Model and sends it to the current View
     * @param frame XRFrame
     */
    updateInstance(inputSourceLeft, inputSourceRight, frame: XRFrame) {
        this.model.left.enabled = false;
        this.model.right.enabled = false;

        if (inputSourceLeft && frame) {
            this.model.left.enabled = true;
            const gamepad = inputSourceLeft.gamepad;

            this.updatePose(frame, this.model.left, this.pointerLeft.uiObject, this.pointerWrapperLeft, inputSourceLeft);
            this.updateEvents(gamepad, this.model.left, this.pointerLeft.uiObject, this.pointerWrapperLeft, CONTROLLER_HANDEDNESS_CODE.LEFT);
            this.updateModel(gamepad, this.model.left);
        } else {
            this.currentOculusQuestView.hideView(CONTROLLER_HANDEDNESS_CODE.LEFT);
        }

        if (inputSourceRight && frame) {
            this.model.right.enabled = true;
            const gamepad = inputSourceRight.gamepad;

            this.updatePose(frame, this.model.right, this.pointerRight.uiObject, this.pointerWrapperRight, inputSourceRight);
            this.updateEvents(gamepad, this.model.right, this.pointerRight.uiObject, this.pointerWrapperRight, CONTROLLER_HANDEDNESS_CODE.RIGHT);
            this.updateModel(gamepad, this.model.right);
        } else {
            this.currentOculusQuestView.hideView(CONTROLLER_HANDEDNESS_CODE.RIGHT);
        }

        this.fire('controllerChange', new ParentEvent('controllerChange', this.model));
        this.currentOculusQuestView.updateView(this.model);
    }

    /**
     * Updates position and orientation of the pointers
     * @param frame XRFrame
     * @param model Gamepad's model which data should be updated
     */
    private updatePose(frame: XRFrame, model, pointer, wrapper, inputSource) {
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
    private updateEvents(gamepad, model, pointer: Object3D, wrapper: Object3D, code: number) {
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
    private updateModel(gamepad, model) {
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

    dispose(code: number) {
        if (code === CONTROLLER_HANDEDNESS_CODE.LEFT) {
            (<Mesh>this.pointerLeft.uiObject).material['dispose']();
            (<Mesh>this.pointerLeft.uiObject).geometry.dispose();
            this.pointerWrapperLeft = null;
        }

        if (code === CONTROLLER_HANDEDNESS_CODE.RIGHT) {
            (<Mesh>this.pointerRight.uiObject).material['dispose']();
            (<Mesh>this.pointerRight.uiObject).geometry.dispose();
            this.pointerWrapperRight = null;
        }
    }
}