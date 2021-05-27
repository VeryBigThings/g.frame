import { IXRControllerView, XRViewStatus, ControllerHandnessCodes, IXRControllerModel } from '@g.frame/common.xr_manager';
import { Loader, FBX_MODEL } from '@g.frame/common.loaders';
import { Object3D, Group, Mesh, CircleBufferGeometry, CylinderBufferGeometry, MeshBasicMaterial } from 'three';
import {LoaderEventsName} from '@g.frame/common.loaders/build/main';

declare function require(s: string): string;

export interface IOculusGoView extends IXRControllerView {
    prepareResources(loader: Loader<any>): void;
}

export class OculusGoView implements IOculusGoView {
    public uiObject: Object3D;

    private _status: XRViewStatus = XRViewStatus.PREPARING;
    private loader: Loader<any>;

    private axisContainer: Group;
    private modelContainer: Object3D;

    private triggerMesh: Object3D;
    private axisIndicator: Mesh;
    private axisMoveFactor: number;
    private ray: Object3D;

    constructor() {
        this.uiObject = new Object3D();
        this.uiObject.name = 'OculusGoViewContainer';
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
                name: 'oculus_go_controller',
                url: require('./assets/models/oculus_go_controller.fbx'),
                type: FBX_MODEL,
            },
        ]);

        this.loader.once(LoaderEventsName.loaded, () => this.addResources());
    }

    /**
     * Returns current status of the Oculus Go view
     */
    getStatus() {
        return this._status;
    }

    /**
     * Adds all models into one uiObject container.
     * Returns current status of the view
     */
    private addResources() {
        this._status = XRViewStatus.READY;

        const controller = this.loader.getResource<Object3D>('oculus_go_controller');

        this.modelContainer = new Group();
        this.modelContainer.name = 'controller container';

        this.modelContainer.add(controller);

        // Trigger button
        this.getTriggerMesh(controller);

        // Axis indicator
        this.setAxisContainer();

        this.uiObject.add(this.modelContainer);

        this.showRayView();

        this.uiObject.traverse(el => {
            el.raycast = () => {};
        });
    }

    /**
     * Updates the whole view of the Oculus Go controller
     * @param viewModel Current state of the model
     */
    updateView(viewModel: IXRControllerModel) {
        const model = viewModel.model;
        if (model.enabled) {
            if (!this.uiObject.visible) this.uiObject.visible = !this.uiObject.visible;
            this.updateButtons(model.trigger);
            this.updateTouch(model);
            this.modelContainer.setRotationFromQuaternion(model.pose.orientation);
        } else {
            this.hideView(ControllerHandnessCodes.NONE);
        }
    }

    /**
     * Shows when trigger button is pressed
     */
    private updateButtons(button: any) {
        if (button.pressed) {
            this.triggerMesh.rotation.x = -0.15;
        } else {
            this.triggerMesh.rotation.x = 0;
        }
    }

    /**
     * Updates position of a circle on a touchpad
     */
    private updateTouch(model: any) {
        model.touchpad.touched ? this.axisIndicator.visible = true : this.axisIndicator.visible = false;
        this.axisIndicator.position.set(model.touchpad.axes.x * this.axisMoveFactor, 0, model.touchpad.axes.y * this.axisMoveFactor);
    }

    /**
     * Finds conroller's trigger button mesh
     */
    private getTriggerMesh(controller: Object3D) {
        controller.traverse((item) => {
            if (item.name === 'trigger') {
                this.triggerMesh = item;
            }
        });
    }

    /**
     * Adds circle to the touchpad
     */
    private setAxisContainer() {
        this.axisContainer = new Group();
        this.axisContainer.name = 'Axis Container';

        this.axisContainer.position.set(0, 0.005, 0.02);

        this.axisIndicator = new Mesh(new CircleBufferGeometry(0.002, 16), new MeshBasicMaterial({color: '#4444ee'}));
        this.axisIndicator.rotateX(Math.PI / -2);
        this.axisContainer.add(this.axisIndicator);
        this.modelContainer.add(this.axisContainer);

        this.axisMoveFactor = 0.019;
    }

    /**
     * Adds ray to the controller
     */
    private showRayView() {
        this.ray = new Mesh(new CylinderBufferGeometry(0.004, 0.002, 8, 8, 1, true), new MeshBasicMaterial({color: '#44aa44'}));
        this.ray.rotation.set(Math.PI / 2, 0, 0);
        this.ray.position.set(0, -0.007, -3.98);
        this.modelContainer.add(this.ray);
    }

    /**
     * Hides Oculus Go controller view
     */
    hideView(code: number) {
        if (code === ControllerHandnessCodes.NONE && this.uiObject) this.uiObject.visible = false;
    }
}