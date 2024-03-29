import {ControllerHandnessCodes, IXRControllerView, XRViewStatus, IXRControllerModel} from '@g.frame/common.xr_manager';
import {FBX_MODEL, Loader, LoaderEventsName} from '@g.frame/common.loaders';
import {Color, ConeBufferGeometry, Group, Mesh, MeshBasicMaterial, Object3D} from 'three';

declare function require(s: string): string;

const lowerButtonOldPos = -0.35;
const lowerButtonNewPos = -0.45;
const upperButtonOldPos = -0.11;
const upperButtonNewPos = -0.21;

const defaultStickXRotation = -0.19;
const maxTriggerAngle = 0.3;
const maxAngle = 0.35;

const defaultEmissive = new Color(0, 0, 0);
const highlightedEmissiveRed = new Color(0.6, 0, 0);
const highlightedEmissiveBlue = new Color(0, 0, 0.6);

export interface IOculusQuestView extends IXRControllerView {
    prepareResources(loader: Loader<any>): void;
}

export class OculusQuestView implements IOculusQuestView {
    uiObject: Object3D;

    private _status: XRViewStatus = XRViewStatus.PREPARING;
    private loader: Loader<any>;

    private rayLeft: Mesh;
    private gamepadLeft: Object3D;
    private gamepadWrapperLeft: Group;

    private rayRight: Mesh;
    private gamepadRight: Object3D;
    private gamepadWrapperRight: Group;

    constructor() {
        this.uiObject = new Object3D();
        this.uiObject.name = 'OculusQuestViewContainer';
    }

    /**
     * Returns current status of the Oculus Quest view
     */
    getStatus() {
        return this._status;
    }

    /**
     * Loads all resources.
     * Adds all models into uiObject when loaded
     * @param loader Current loader
     */
    prepareResources(loader: Loader<any>) {
        this.loader = loader;
        this.loader.addResources([
            {
                name: 'quest_controllers',
                url: require('./assets/models/oculus_quest_controllers.fbx'),
                type: FBX_MODEL,
            },
        ]);

        this.loader.once(LoaderEventsName.loaded, () => this.addResources());
    }

    /**
     * Updates the whole view of the Oculus Quest controllers
     * @param viewModel Current state of the model
     */
    updateView(viewModel: IXRControllerModel) {
        const model = viewModel.model;
        if (model.left.enabled) {
            this.showView(model.left, this.gamepadLeft, this.gamepadWrapperLeft, -1);
        } else this.hideView(ControllerHandnessCodes.LEFT);

        if (model.right.enabled) {
            this.showView(model.right, this.gamepadRight, this.gamepadWrapperRight);
        } else this.hideView(ControllerHandnessCodes.RIGHT);
    }

    /**
     * Hides Oculus Quest controller view
     * @param code Controller code which should be hided
     */
    hideView(code: number) {
        if (code === ControllerHandnessCodes.LEFT && this.gamepadWrapperLeft) this.gamepadWrapperLeft.visible = false;
        if (code === ControllerHandnessCodes.RIGHT && this.gamepadWrapperRight) this.gamepadWrapperRight.visible = false;
    }

    /**
     * Adds all models into one uiObject container
     * Updates current status of the view
     */
    private addResources() {
        this._status = XRViewStatus.READY;

        this.gamepadWrapperLeft = new Group();
        this.gamepadWrapperLeft.name = 'LeftGamepadWrapper';
        this.gamepadWrapperRight = new Group();
        this.gamepadWrapperRight.name = 'RightGamepadWrapperer';
        this.uiObject.add(this.gamepadWrapperLeft, this.gamepadWrapperRight);

        const controller = this.loader.getResource<Object3D>('quest_controllers');
        // @ts-ignore
        const material = controller.children[0].material;
        controller.children.forEach(el => {
            if (el.name === 'l_controller') {
                this.gamepadLeft = el.clone();
                this.gamepadLeft.userData = {};
                this.gamepadLeft.rotation.set(Math.PI / -2, 0, Math.PI);
                this.gamepadRight = el.clone();
                this.gamepadRight.userData = {};
                this.gamepadRight.rotation.set(Math.PI / -2, 0, Math.PI);
                // @ts-ignore
                this.gamepadLeft.material = material.clone();
                // @ts-ignore
                this.gamepadRight.material = material.clone();
                this.gamepadRight.scale.set(-0.01, 0.01, 0.01);
            } else if (el.name === 'y_button' || el.name === 'x_button' || el.name === 'home_button' || el.name === 'stick_l') {
                const elem = el.clone();
                elem.position.z = el.position.y;
                elem.position.y = -el.position.z;
                elem.position.multiplyScalar(100);
                elem.scale.set(1, 1, 1);
                elem.rotateX(Math.PI / 2);
                if (el.name === 'stick_l') {
                    // @ts-ignore
                    elem.material.emissiveIntensity = 1;
                }
                // @ts-ignore
                elem.material = material.clone();
                if (el.name === 'y_button' || el.name === 'x_button') {
                    // @ts-ignore
                    elem.material.emissiveIntensity = 1;
                    if (el.name === 'y_button') {
                        this.gamepadLeft.userData.topBtn = elem;
                    }
                    if (el.name === 'x_button') {
                        this.gamepadLeft.userData.botBtn = elem;
                    }
                }
                this.gamepadLeft.add(elem);
                if (el.name === 'stick_l') {
                    this.gamepadLeft.userData.stick = elem;
                    const elem2: Mesh = (<Mesh>elem).clone();

                    elem2.material = material.clone();
                    // @ts-ignore
                    elem2.material.emissiveIntensity = 1;
                    this.gamepadRight.add(elem2);
                    this.gamepadRight.userData.stick = elem2;
                }
            } else if (el.name === 'trigger_l' || el.name === 'squeeze_l') {
                const elem = el.clone();
                elem.position.z = el.position.y;
                elem.position.y = -el.position.z;
                elem.position.multiplyScalar(100);
                elem.scale.set(1, 1, 1);
                elem.rotateX(Math.PI / 2);
                // @ts-ignore
                elem.material.emissiveIntensity = 1;
                if (elem.name === 'squeeze_l') {
                    elem.rotation.set(0.513606032270421, 0.12161030528663896, 0.18800863837341958);
                }
                // @ts-ignore
                elem.material = material.clone();
                const elem2 = elem.clone();
                // @ts-ignore
                elem2.material = material.clone();
                this.gamepadLeft.add(elem);
                this.gamepadRight.add(elem2);
                if (el.name === 'trigger_l') {
                    this.gamepadLeft.userData.trigger = elem;
                    this.gamepadRight.userData.trigger = elem2;
                }
                if (el.name === 'squeeze_l') {
                    this.gamepadLeft.userData.squeeze = elem;
                    this.gamepadRight.userData.squeeze = elem2;
                }

            } else {
                const elem = el.clone();
                // @ts-ignore
                elem.material.emissive = new Color(1, 1, 1);
                elem.position.z = el.position.y;
                elem.position.y = -el.position.z;
                elem.position.x = -el.position.x;
                elem.position.multiplyScalar(100);
                elem.scale.set(-1, 1, 1);
                elem.rotateX(Math.PI / 2);
                // @ts-ignore
                elem.material = material.clone();
                if (el.name === 'b_button' || el.name === 'a_button') {
                    // @ts-ignore
                    elem.material.emissiveIntensity = 1;

                    if (el.name === 'b_button') {
                        this.gamepadRight.userData.topBtn = elem;
                    }
                    if (el.name === 'a_button') {
                        this.gamepadRight.userData.botBtn = elem;
                    }
                }
                this.gamepadRight.add(elem);
            }
        });

        // Sets corresponding Gamepad's color
        this.gamepadLeft.userData.emissiveColor = highlightedEmissiveRed;
        this.gamepadRight.userData.emissiveColor = highlightedEmissiveBlue;

        // Left ray
        this.rayLeft = new Mesh(new ConeBufferGeometry(0.0025, 1.5, 16), new MeshBasicMaterial({color: 'red'}));
        this.rayLeft.position.set(0.95, -151, -0.5);
        this.rayLeft.scale.set(100, 200, 100);
        this.rayLeft.rotateX(Math.PI);
        this.gamepadLeft.add(this.rayLeft);

        // Right ray
        this.rayRight = new Mesh(new ConeBufferGeometry(0.0025, 1.5, 16), new MeshBasicMaterial({color: 'blue'}));
        this.rayRight.position.set(0.95, -151, -0.5);
        this.rayRight.scale.set(100, 200, 100);
        this.rayRight.rotateX(Math.PI);
        this.gamepadRight.add(this.rayRight);

        // uiObject
        this.gamepadWrapperLeft.add(this.gamepadLeft);
        this.gamepadWrapperRight.add(this.gamepadRight);
        this.uiObject.traverse(el => {
            el.raycast = () => {};
        });
    }

    /**
     * Updates one Oculus Quest controller view
     * @param model Current state of the model
     * @param gamepad View of the gamepad
     * @param wrapper Gamepad's wrapper. It is necessary because we rotate the wrapper using Quaternion and the gamepad using Euler
     * @param coefficient Left view should be mirrored
     */
    private showView(model: any, gamepad: any, wrapper: Group, coefficient: number = 1) {
        if (!wrapper) return;
        // Check if hided
        if (!wrapper.visible) wrapper.visible = !wrapper.visible;

        // Model
        wrapper.position.copy(model.pose.position);
        wrapper.quaternion.copy(model.pose.orientation);

        // Buttons
        const stickLeft = gamepad.userData.stick;
        const triggerLeft = gamepad.userData.trigger;
        const squeezeLeft = gamepad.userData.squeeze;
        const botBtn = gamepad.userData.botBtn;
        const topBtn = gamepad.userData.topBtn;

        // @ts-ignore
        if (model.stick.touched || model.stick.axes.z || model.stick.axes.w) {
            stickLeft.material.emissive = gamepad.userData.emissiveColor;
        } else {
            stickLeft.material.emissive = defaultEmissive;
        }
        stickLeft.rotation.set(defaultStickXRotation - maxAngle * model.stick.axes.w, maxAngle * coefficient * model.stick.axes.z, 0);

        // @ts-ignore
        triggerLeft.material.emissive = model.trigger.touched ? gamepad.userData.emissiveColor : defaultEmissive;
        triggerLeft.rotation.set(maxTriggerAngle * model.trigger.value, 0, 0);

        // @ts-ignore
        squeezeLeft.material.emissive = model.squeeze.touched ? gamepad.userData.emissiveColor : defaultEmissive;
        squeezeLeft.position.set(-0.35 + 0.2 * model.squeeze.value, 2.23 + 0.03 * model.squeeze.value, -2.98 - 0.02 * model.squeeze.value),
            squeezeLeft.rotation.set(0.51, 0.12 - 0.1 * model.squeeze.value, 0.19 - 0.14 * model.squeeze.value);

        // @ts-ignore
        botBtn.material.emissive = model.botBtn.touched ? gamepad.userData.emissiveColor : defaultEmissive;
        botBtn.position.z = model.botBtn.pressed ? lowerButtonNewPos : lowerButtonOldPos;

        // @ts-ignore
        topBtn.material.emissive = model.topBtn.touched ? gamepad.userData.emissiveColor : defaultEmissive;
        topBtn.position.z = model.topBtn.pressed ? upperButtonNewPos : upperButtonOldPos;
    }
}
