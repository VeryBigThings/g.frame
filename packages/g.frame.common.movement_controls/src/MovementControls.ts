import {CircleGeometry, CylinderGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3, Color} from 'three';
import {IMovementControlsModuleOptions} from './MovementControlsModule';
import {EventDispatcher} from '@verybigthings/g.frame.core';
import {
    ActionControllerEventName,
    ActionControllerEvent,
    ActionController
} from '@verybigthings/g.frame.common.action_controller';
import {CameraControls} from '@verybigthings/g.frame.common.camera_controls';

// import {IOculusQuestControllersModel} from '@verybigthings/g.frame.oculus.quest';

export class MovementControls extends EventDispatcher<ActionControllerEventName> {
    public waypoint: Waypoint;
    public navigatonMeshes: Array<Object3D> = [];

    constructor(public actionController: ActionController, public cameraControls: CameraControls, public options: IMovementControlsModuleOptions) {
        super();
        this.initWaypoint(this.options.waypoint);
    }

    initWaypoint(options: IWaypointOptions) {
        this.waypoint = new Waypoint(options);
        this.actionController.on(ActionControllerEventName.click, this.waypoint.container, (event) => this.onClick(event));
    }

    onClick(event: ActionControllerEvent) {

    }

    addNavigationMesh(mesh: Object3D) {
        this.navigatonMeshes.push(mesh);
        console.log('nav mesh added');
        this.actionController.on(ActionControllerEventName.move, mesh, (event) => this.onMove(event));
    }

    onMove(event: ActionControllerEvent) {

    }

}


export class Locomotion extends MovementControls {

    constructor(public actionController: ActionController, public cameraControls: CameraControls, options: IMovementControlsModuleOptions) {
        super(actionController, cameraControls, options);
        this.initEvents();
    }

    initEvents() {
        this.actionController.on(ActionControllerEventName.move, null, (event) => {
            if (event.data.context.oculusQuestModel) {
                this.moveQuestCamera(event.data.context.oculusQuestModel.model);
            } else if (event.data.context.oculusGoModel) {
                this.moveGoCamera(event.data.context.oculusGoModel.model);
            }
        });
    }

    moveQuestCamera(model: any) {
        if (model.left.enabled) {
            // console.log('model', model.right.stick.axes);
            if (model.left.stick.axes.z !== 0 || model.left.stick.axes.w !== 0) {
                const addedVector = new Vector3();
                if (model.left.stick.pressed) {
                    addedVector.set(.075 * model.left.stick.axes.z, 0, 0.075 * model.left.stick.axes.w);
                } else {
                    addedVector.set(0.05 * model.left.stick.axes.z, 0, 0.05 * model.left.stick.axes.w);
                }
                // const euler = this.cameraControls.getOrientation();
                // if (euler) addedVector.applyEuler(euler);
                this.cameraControls.addPosition(addedVector);
            }
            if (model.right.enabled) {
                if (model.right.stick.axes.z !== 0) {
                    const addedVector = new Vector3();
                    if (model.right.stick.pressed) {
                        addedVector.set(0, -.05 * model.right.stick.axes.w, 0);
                    } else {
                        addedVector.set(0, -.025 * model.right.stick.axes.w, 0);
                    }
                    // const euler = this.cameraControls.getOrientation();
                    // if (euler) addedVector.applyEuler(euler);
                    this.cameraControls.addPosition(addedVector);
                }
            }
        } else if (model.right.enabled) {
            if (model.right.stick.axes.z !== 0 || model.right.stick.axes.w !== 0) {
                if (model.right.stick.pressed) {
                    this.cameraControls.addPosition(new Vector3(0.075 * model.right.stick.axes.z, 0, 0.075 * model.right.stick.axes.w));
                } else {
                    this.cameraControls.addPosition(new Vector3(0.05 * model.right.stick.axes.z, 0, 0.05 * model.right.stick.axes.w));
                }
            }
        }
    }

    moveGoCamera(model: any) {
        if (model.enabled) {
            // console.log('model', model.right.touchpad.axes);
            if (model.touchpad.axes.z !== 0 || model.touchpad.axes.w !== 0) {
                const addedVector = new Vector3(0.05 * model.touchpad.axes.z, 0, 0.05 * model.touchpad.axes.w);
                // const euler = this.cameraControls.getOrientation();
                // if (euler) addedVector.applyEuler(euler);
                this.cameraControls.addPosition(addedVector);
            }
        }
    }
}

export class Teleport extends MovementControls {
    private maxTeleportDistance: number;

    constructor(public actionController: ActionController, public cameraControls: CameraControls, options: IMovementControlsModuleOptions) {
        super(actionController, cameraControls, options);
        this.maxTeleportDistance = options.maxTeleportDistance;
    }

    onClick(event: ActionControllerEvent) {
        const clickLocation = event.data.intersection.point;
        console.log('teleported to', event);
        this.cameraControls.setPosition(clickLocation.x, null, clickLocation.z);
    }

    onMove(event: ActionControllerEvent) {
        // // @ts-ignore
        // if (event.data.context.oculusQuestModel) {
        //     // console.log('oculusQuestActionControllerEvent', event);
        //
        //     // @ts-ignore
        //     const model = event.data.context.oculusQuestModel.model;
        //     if (model.left.enabled) {
        //         if (+Number(model.left.stick.axes.z).toFixed(3) !== 0 || +Number(model.left.stick.axes.w).toFixed(3) !== 0) {
        //             // dead zone added
        //             // console.log('stick tilted enough', event);

        if (this.checkTeleportAbility(event, 0)) {
            this.waypoint.container.position.copy(event.data.intersection.point);
            this.waypoint.start();
        } else {
            this.waypoint.stop();
        }
        //         } else {
        //             this.waypoint.stop();
        //         }
        //     } else if (model.right.enabled) {
        //
        //     }
        // } else {
        //     this.waypoint.stop();
        // }
    }

    checkTeleportAbility(event: ActionControllerEvent, controllerNumber: number = 0): boolean {
        if (event.data.controllerNumber !== controllerNumber) return false;
        if (!event.data.intersection?.object) return false;
        // if (this.navigatonMeshes.indexOf(event.data.intersection.object) < 0) return false;
        if (event.data.intersection.point.distanceTo(this.cameraControls.getPosition()) > this.maxTeleportDistance) return false;
        return event.data.intersection.object.userData.navMesh;
    }
}

export interface IWaypointOptions {
    componentRadius?: number;
    componentHeight?: number;
    speed?: number;
    bottomColor?: string;
    wallsColor?: string;
}

class Waypoint {
    readonly background: Mesh;
    readonly border: Mesh;
    readonly container: Object3D;
    private interval: any;
    private speed: number;
    private componentRadius: number;
    private componentHeight: number;


    constructor(options: IWaypointOptions) {
        this.componentRadius = options?.componentRadius || .2;
        this.componentHeight = options?.componentHeight || .1;
        this.speed = options?.speed || 40;
        this.container = new Object3D();
        let clickableBack = new Mesh(new CircleGeometry(this.componentRadius, 16), new MeshBasicMaterial({visible: false}));
        clickableBack.rotation.set(-Math.PI / 2, 0, 0);
        this.container.add(clickableBack);

        this.background = new Mesh(new CircleGeometry(this.componentRadius, 32), new MeshBasicMaterial({
            color: options.wallsColor || options.bottomColor || 'white',
            opacity: 0.7,
            transparent: true,
            side: 2
        }));
        this.background.position.set(0, 0, -0.01);
        this.background.rotation.set(-Math.PI / 2, 0, 0);
        this.container.add(this.background);
        this.border = new Mesh(new CylinderGeometry(this.componentRadius, this.componentRadius, this.componentHeight, 32, 1, true), new MeshBasicMaterial({
            color: options.bottomColor || options.wallsColor || 'white',
            opacity: 0.7,
            transparent: true,
            side: 2
        }));
        this.border.position.set(0, -this.componentHeight / 2 - 0.01, -0.02);
        this.border.geometry.translate(0, this.componentHeight, 0);
        this.container.add(this.border);
        this.container.visible = false;
    }

    animate() {
        this.background.scale.setScalar(0.1);

        this.interval = setInterval(() => {
            if (this.background.scale.x > .99) {
                this.background.scale.setScalar(0.1);
            } else {
                this.background.scale.addScalar(0.05);
            }
            (<any>this.background.material).opacity = 1 - this.background.scale.x;
        }, this.speed);
    }

    stop() {
        this.interval && clearInterval(this.interval);
        this.interval = null;
        this.background.scale.set(1, 1, 1);
        this.container.visible = false;
    }

    start() {
        if (!this.container.visible) {
            console.log('waypoint started');
            this.container.visible = true;
            this.animate();
        }
    }
}