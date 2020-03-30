import {Matrix4, Mesh, Object3D, Quaternion, Vector3, Vector4} from 'three';
import {ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {IOculusQuestView, OculusQuestView} from '../View/OculusQuestView';
import {VRControlsEvent} from '../QuestControllers/VRControlsEvent';
import {Pointer} from '../QuestControllers/Pointer';

const controllerHandednessCode = {
    left: 0,
    right: 1,
};

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

export class OculusQuestModel extends ViewerModule {
    private static instance: OculusQuestModel;
    private mainOculusQuestView: OculusQuestView;
    private currentOculusQuestView: IOculusQuestView;

    private pointerLeft: Pointer;
    private pointerRight: Pointer;
    private pointerWrapperLeft: Object3D;
    private pointerWrapperRight: Object3D;

    private model: Model;

    private constructor(private data: any) {
        super();

        this.mainOculusQuestView = new OculusQuestView(this.data);
        this.currentOculusQuestView = this.mainOculusQuestView;
        this.addObject(this.currentOculusQuestView);

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

    public static getInstance(data?: any): OculusQuestModel {
        if (!OculusQuestModel.instance)
            OculusQuestModel.instance = new OculusQuestModel(data);

        return OculusQuestModel.instance;
    }

    initView() {
        this.mainOculusQuestView.init();
    }

    /**
     * Private function to set Pointers in 3d space
     */
    setPointers() {
        // Left pointer
        this.pointerWrapperLeft = new Object3D();
        this.pointerLeft = new Pointer(this.data.viewer.scene, {color: 0xff2222}, this.data.viewer.camera);
        this.pointerLeft.uiObject.position.set(-0.0095, -0.00151, -5);
        this.pointerLeft.uiObject.rotation.set(0, Math.PI, 0);
        this.pointerWrapperLeft.add(this.pointerLeft.uiObject);

        // Right pointer
        this.pointerWrapperRight = new Object3D();
        this.pointerRight = new Pointer(this.data.viewer.scene, {color: 0x2222ff}, this.data.viewer.camera);
        this.pointerRight.uiObject.position.set(0.0095, -0.00151, -5);
        this.pointerRight.uiObject.rotation.set(0, Math.PI, 0);
        this.pointerWrapperRight.add(this.pointerRight.uiObject);

        this.addObject(this.pointerWrapperLeft);
        this.addObject(this.pointerWrapperRight);
    }

    updateInstance(inputSourceLeft, inputSourceRight, frame: XRFrame) {
        this.model.left.enabled = false;
        this.model.right.enabled = false;

        if (inputSourceLeft && frame) {
            this.model.left.enabled = true;
            const gamepad = inputSourceLeft.gamepad;

            this.updatePose(frame, this.model.left, this.pointerLeft.uiObject, this.pointerWrapperLeft, inputSourceLeft);
            this.updateEvents(gamepad, this.model.left, this.pointerLeft.uiObject, this.pointerWrapperLeft, controllerHandednessCode.left);
            this.updateModel(gamepad, this.model.left);
        } else {
            this.currentOculusQuestView.hideView('left');
        }

        if (inputSourceRight && frame) {
            this.model.right.enabled = true;
            const gamepad = inputSourceRight.gamepad;

            this.updatePose(frame, this.model.right, this.pointerRight.uiObject, this.pointerWrapperRight, inputSourceRight);
            this.updateEvents(gamepad, this.model.right, this.pointerRight.uiObject, this.pointerWrapperRight, controllerHandednessCode.right);
            this.updateModel(gamepad, this.model.right);
        } else {
            this.currentOculusQuestView.hideView('right');
        }

        this.fire('controllerChange', new ParentEvent('controllerChange', this.model));
        this.currentOculusQuestView.updateView(this.model);
    }

    getEventData(uiObject: Object3D, controller: Object3D, controllerNumber: number): VRControlsEvent {
        return new VRControlsEvent('createdEvent', uiObject.localToWorld(new Vector3()), controller.localToWorld(new Vector3()), controllerNumber);
    }

    dispose() { // Maybe need to add some custom dispose parameters for left and right pointers and their wrappers
        (<Mesh>this.pointerLeft.uiObject).material['dispose']();
        (<Mesh>this.pointerLeft.uiObject).geometry.dispose();

        (<Mesh>this.pointerRight.uiObject).material['dispose']();
        (<Mesh>this.pointerRight.uiObject).geometry.dispose();
    }

    private updatePose(frame: XRFrame, controllerModelHand, controller, uiObjectWrapper, inputSource) {
        const inputPose = frame.getPose(inputSource.targetRaySpace, this.data.viewer.renderer.xr.getReferenceSpace());
        new Matrix4().fromArray(inputPose.transform.matrix).decompose(controllerModelHand.pose.position, controllerModelHand.pose.orientation, new Vector3());
        new Matrix4().fromArray(inputPose.transform.matrix).decompose(uiObjectWrapper.position, uiObjectWrapper.quaternion, new Vector3());

        this.uiObject.updateMatrixWorld(true);
        controller.updateMatrixWorld(true);
    }

    /**
     * Updates custom events
     * @param gamepad
     * @param model
     * @param controller
     * @param controllerWrapper
     * @param controllerNumber
     */
    private updateEvents(gamepad, model, controller: Object3D, controllerWrapper: Object3D, controllerNumber: number) {
        const newButtonDown = gamepad.buttons[0].pressed;

        this.fire('move', new ParentEvent<string>('move', this.getEventData(controllerWrapper, controller, controllerNumber)));
        if (!model.trigger.pressed && newButtonDown) {
            this.fire('buttonDown', new ParentEvent<string>('buttonDown', this.getEventData(controllerWrapper, controller, controllerNumber)));
        }
        if (model.trigger.pressed && !newButtonDown) {
            this.fire('buttonUp', new ParentEvent<string>('buttonUp', this.getEventData(controllerWrapper, controller, controllerNumber)));
            this.fire('click', new ParentEvent<string>('click', this.getEventData(controllerWrapper, controller, controllerNumber)));
        }
        model.trigger.pressed = newButtonDown;
    }

    private updateModel(gamepad, controllerModel) {
        controllerModel.stick.axes = new Vector4(gamepad.axes[0], gamepad.axes[1], gamepad.axes[2], gamepad.axes[3]);
        controllerModel.trigger.value = gamepad.buttons[0].value;
        controllerModel.squeeze.value = gamepad.buttons[1].value;
        gamepad.buttons.forEach((el: GamepadButton, index: number) => {
            controllerModel[config[index]] && (controllerModel[config[index]].touched = el.touched);
            controllerModel[config[index]] && (controllerModel[config[index]].pressed = el.pressed);
            controllerModel[config[index]] && (controllerModel[config[index]].value = el.value);
        });
    }
}