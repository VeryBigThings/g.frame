import { ControllerHandnessCodes, IXRControllerModel, XRControllerModelEvents, IOculusGoControllerModel } from '@verybigthings/g.frame.common.xr_manager';
import { EventDispatcher, ParentEvent } from '@verybigthings/g.frame.core';
import { Object3D, Vector3, Quaternion, Vector4, Mesh, Matrix4 } from 'three';
import { IOculusGoView } from './OculusGoView';
import { Pointer } from './OculusGoControllers/Pointer';
import { VRControlsEvent } from './OculusGoControllers/VRControlsEvent';

const config = {
    0: 'trigger',
    2: 'touchpad',
};

type XRFrame = any;

export class OculusGoModel extends EventDispatcher<XRControllerModelEvents> implements IXRControllerModel {
    public mainContainer: Object3D;

    public model: IOculusGoControllerModel;
    private currentOculusGoView: IOculusGoView;

    private pointer: Pointer;
    private pointerWrapper: Object3D;

    private frame: XRFrame;
    private inputSource: any;

    constructor(private viewer: any) {
        super();

        this.mainContainer = new Object3D();
        this.mainContainer.position.set(0.4, -0.5, 0);
        this.mainContainer.name = 'View&PointersContainer';

        this.model = {
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
            touchpad: {
                axes: new Vector4(),
                touched: false,
                clicked: false,
                pressed: false,
            },
        };

        this.setPointer();
    }

    private setPointer() {
        this.pointerWrapper = new Object3D();
        this.pointer = new Pointer(this.viewer.scene, { color: 0x2222ff }, this.viewer.camera);
        this.pointer.uiObject.position.set(0, -0.007, -10);
        this.pointer.uiObject.rotation.set(0, Math.PI, 0);
        this.pointerWrapper.add(this.pointer.uiObject);

        this.mainContainer.add(this.pointerWrapper);
    }

    updateView(newOculusGoView: IOculusGoView | null) {
        this.currentOculusGoView?.uiObject?.parent?.remove(this.currentOculusGoView.uiObject);
        this.currentOculusGoView = newOculusGoView;
        this.mainContainer.add(this.currentOculusGoView?.uiObject);
    }

    manipulateModel(inputSource, frame: XRFrame) {
        this.model.enabled = false;
        this.inputSource = inputSource;
        this.frame = frame;

        if (this.inputSource && frame) {
            this.model.enabled = true;

            this.updatePose();
            this.updateEvents();
            this.updateModel();
        } else {
            this.currentOculusGoView?.hideView(ControllerHandnessCodes.NONE);
        }

        this.fire(XRControllerModelEvents.controllerChanged, new ParentEvent(XRControllerModelEvents.controllerChanged, this.model));
        this.currentOculusGoView?.updateView(this);
    }

    /**
     * Updates position and orientation
     */
    private updatePose() {
        const inputPose = this.frame.getPose(this.inputSource.targetRaySpace, this.viewer.renderer.xr.getReferenceSpace());
        new Matrix4().fromArray(inputPose.transform.matrix).decompose(this.model.pose.position, this.model.pose.orientation, new Vector3());
        new Matrix4().fromArray(inputPose.transform.matrix).decompose(new Vector3(), this.pointerWrapper.quaternion, new Vector3());

        this.pointer.uiObject.updateMatrixWorld(true);
        this.mainContainer.updateMatrixWorld(true);
    }

    /**
     * Updates custom events
     */
    private updateEvents() {
        const newButtonDown = this.inputSource.gamepad.buttons[0].pressed;

        this.fire(XRControllerModelEvents.move, new ParentEvent(XRControllerModelEvents.move, this.getEventData()));
        if (!this.model.trigger.pressed && newButtonDown) {
            this.fire(XRControllerModelEvents.buttonDown, new ParentEvent(XRControllerModelEvents.buttonDown, this.getEventData()));
        }
        if (this.model.trigger.pressed && !newButtonDown) {
            this.fire(XRControllerModelEvents.buttonUp, new ParentEvent(XRControllerModelEvents.buttonUp, this.getEventData()));
            this.fire(XRControllerModelEvents.click, new ParentEvent(XRControllerModelEvents.click, this.getEventData()));
        }
        this.model.trigger.pressed = newButtonDown;
    }

    /**
     * Updates the Model
     */
    private updateModel() {
        const gamepad = this.inputSource.gamepad;

        this.model.touchpad.axes = new Vector4(gamepad.axes[0], gamepad.axes[1]);
        gamepad.buttons.forEach((el: GamepadButton, index: number) => {
            this.model[config[index]] && (this.model[config[index]].touched = el.touched);
            this.model[config[index]] && (this.model[config[index]].pressed = el.pressed);
            this.model[config[index]] && (this.model[config[index]].value = el.value);
        });
    }

    getEventData(): VRControlsEvent {
        return new VRControlsEvent('createdEvent', this.pointerWrapper.localToWorld(new Vector3()), this.pointer.uiObject.localToWorld(new Vector3()));
    }

    dispose() {
        (<Mesh>this.pointer.uiObject).material['dispose']();
        (<Mesh>this.pointer.uiObject).geometry.dispose();
    }
}