import { EventDispatcher, ParentEvent } from '@verybigthings/g.frame.core';
import { Loader } from '@verybigthings/g.frame.common.loaders';
import { Object3D, Vector3, Quaternion, Vector4, Mesh, Matrix4 } from 'three';
import OculusGoView, { IOculusGoView } from './OculusGoView';
import { Pointer } from '../Controllers/Pointer';
import { VRControlsEvent } from '../Controllers/VRControlsEvent';

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

export class OculusGoModel extends EventDispatcher<string> {
    public mainContainer: Object3D;

    private model: Model;
    private mainOculusGoView: OculusGoView;
    private currentOculusGoView: IOculusGoView;

    private pointer: Pointer;
    private pointerWrapper: Object3D;

    constructor(private viewer: any) {
        super();

        this.mainOculusGoView = new OculusGoView();
        this.currentOculusGoView = this.mainOculusGoView;

        this.mainContainer = new Object3D();
        this.mainContainer.name = 'OculusGoView&PointersContainer';
        this.mainContainer.add(this.currentOculusGoView.uiObject);
        this.mainContainer.position.set(0.4, -0.5, 0);

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
            touchpad: {
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
        };

        this.setPointer();
    }

    private setPointer() {
        this.pointerWrapper = new Object3D();
        this.pointer = new Pointer(this.viewer.scene, { color: 0x2222ff }, this.viewer.camera);
        this.pointer.uiObject.position.set(0, -0.007, -5);
        this.pointer.uiObject.rotation.set(0, Math.PI, 0);
        this.pointerWrapper.add(this.pointer.uiObject);

        this.mainContainer.add(this.pointerWrapper);
    }

    prepareResources(loader: Loader<any>) {
        this.mainOculusGoView.prepareResources(loader);
    }

    manipulateModel(inputSourceRight, frame: XRFrame) {
        this.model.enabled = false;

        if (inputSourceRight && frame) {
            this.model.enabled = true;
            const gamepad = inputSourceRight.gamepad;

            this.updatePose(inputSourceRight, frame);
            this.updateEvents(gamepad);
            this.updateModel(gamepad);
        } else {
            this.currentOculusGoView?.hideView();
        }

        this.fire('controllerChange', new ParentEvent('controllerChange', this.model));
        this.currentOculusGoView?.updateView(this.model);
    }

    private updatePose(inputSource, frame: XRFrame) {
        const inputPose = frame.getPose(inputSource.targetRaySpace, this.viewer.renderer.xr.getReferenceSpace());
        new Matrix4().fromArray(inputPose.transform.matrix).decompose(this.model.pose.position, this.model.pose.orientation, new Vector3());
        new Matrix4().fromArray(inputPose.transform.matrix).decompose(new Vector3(), this.pointerWrapper.quaternion, new Vector3());

        this.pointer.uiObject.updateMatrixWorld(true);
        this.mainContainer.updateMatrixWorld(true);
    }

    /**
     * Updates custom events
     * @param gamepad
     * @param model
     * @param controller
     * @param controllerWrapper
     * @param controllerNumber
     */
    private updateEvents(gamepad) {
        const newButtonDown = gamepad.buttons[0].pressed;

        this.fire('move', new ParentEvent<string>('move', this.getEventData()));
        if (!this.model.trigger.pressed && newButtonDown) {
            this.fire('buttonDown', new ParentEvent<string>('buttonDown', this.getEventData()));
        }
        if (this.model.trigger.pressed && !newButtonDown) {
            this.fire('buttonUp', new ParentEvent<string>('buttonUp', this.getEventData()));
            this.fire('click', new ParentEvent<string>('click', this.getEventData()));
        }
        this.model.trigger.pressed = newButtonDown;
    }

    private updateModel(gamepad) {
        this.model.stick.axes = new Vector4(gamepad.axes[0], gamepad.axes[1], gamepad.axes[2], gamepad.axes[3]);
        this.model.trigger.value = gamepad.buttons[0].value;
        this.model.squeeze.value = gamepad.buttons[1].value;
        gamepad.buttons.forEach((el: GamepadButton, index: number) => {
            this.model[config[index]] && (this.model[config[index]].touched = el.touched);
            this.model[config[index]] && (this.model[config[index]].pressed = el.pressed);
            this.model[config[index]] && (this.model[config[index]].value = el.value);
        });
    }

    getEventData(): VRControlsEvent {
        return new VRControlsEvent('createdEvent',  this.pointerWrapper.localToWorld(new Vector3()), this.pointer.uiObject.localToWorld(new Vector3()));
    }

    dispose() {
        (<Mesh>this.pointer.uiObject).material['dispose']();
        (<Mesh>this.pointer.uiObject).geometry.dispose();
    }
}