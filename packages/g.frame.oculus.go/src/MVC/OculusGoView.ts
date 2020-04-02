import { Loader, FBX_MODEL } from '@verybigthings/g.frame.common.loaders';
import { Object3D, Group, Mesh, CircleBufferGeometry, CylinderBufferGeometry, MeshBasicMaterial } from 'three';

declare function require(s: string): string;

export interface IOculusGoView {
    uiObject: Object3D;
    prepareResources(loader: Loader<any>): void;
    updateView(viewModel: any): void;
    hideView(): void;
}

export default class OculusGoView implements IOculusGoView {
    public uiObject: Object3D;
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

    prepareResources(loader: Loader<any>) {
        this.loader = loader;
        this.loader.addResources([
            {
                name: 'oculus_go_controller',
                url: require('../assets/model/oculus_go_controller.fbx'),
                type: FBX_MODEL,
            },
        ]);

        this.loader.once('loaded', () => this.addResources());
    }

    private addResources() {
        const controller = this.loader.getResource<Object3D>('oculus_go_controller');

        this.modelContainer = new Group();
        this.modelContainer.name = 'controller container';

        this.modelContainer.add(controller);

        // trigger button
        this.getTriggerMesh(controller);

        // axis indicator
        this.setAxisContainer();

        this.uiObject.add(this.modelContainer);

        this.showRayView();

        this.uiObject.traverse(el => {
            el.raycast = () => {};
        });
    }

    updateView(model: any) {
        if (model.enabled) {
            if (!this.uiObject.visible) this.uiObject.visible = !this.uiObject.visible;
            this.updateButtons(model.trigger);
            this.updateTouch(model);
            this.modelContainer.setRotationFromQuaternion(model.pose.orientation);
        } else {
            this.hideView();
        }
    }

    private updateButtons(button: any) {
        if (button.pressed) {
            this.triggerMesh.rotation.x = -0.15;
        } else {
            this.triggerMesh.rotation.x = 0;
        }
    }

    private updateTouch(controller: any) {
        controller.touchpad.touched ? this.axisIndicator.visible = true : this.axisIndicator.visible = false;
        this.axisIndicator.position.set(controller.stick.axes.x * this.axisMoveFactor, 0, controller.stick.axes.y * this.axisMoveFactor);
    }

    private getTriggerMesh(controller: Object3D) {
        controller.traverse((item) => {
            if (item.name === 'trigger') {
                this.triggerMesh = item;
            }
        });
    }

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

    private showRayView() {
        this.ray = new Mesh(new CylinderBufferGeometry(0.004, 0.002, 8, 8, 1, true), new MeshBasicMaterial({color: '#44aa44'}));
        this.ray.rotation.set(Math.PI / 2, 0, 0);
        this.ray.position.set(0, -0.007, -3.98);
        this.modelContainer.add(this.ray);
    }

    hideView() {
        this.uiObject.visible = false;
    }
}