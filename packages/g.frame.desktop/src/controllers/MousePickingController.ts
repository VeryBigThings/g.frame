import {
    IPickingControllerConfig,
    PickingController,
    PickingControllerEventNames
} from '@verybigthings/g.frame.common.picking_controller';
import {MouseActionController} from './MouseActionController';
import {ActionControllerEvent, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import {Vector3, Quaternion, Scene, Raycaster, Ray, Object3D, Intersection, Box3, Mesh} from 'three';
import {OrbitControls} from '..';
import {ParentEvent} from '@verybigthings/g.frame.core';

interface IMousePickingControllerConfig extends IPickingControllerConfig {
    offSet?: number;
}


export class MousePickingController extends PickingController {
    private lastDistance: number;
    private controls: OrbitControls;
    private currentObject: Object3D;
    private scene: Scene;

    constructor(protected data: any, protected config: IMousePickingControllerConfig, protected mouseActionController: MouseActionController) {
        super(config);
        this.config.offSet = this.config.offSet || 0.95;
        this.scene = data.viewer.scene;
    }

    init(controls: OrbitControls) {
        this.lastDistance = this.config.maxPickingDistance;
        this.controls = controls;

        this.mouseActionController.on(ActionControllerEventName.move, null, (event) => {
            if (this.currentObject && this.enabled) {
                const newPosition = this.getPosition(event);
                // console.log('newPosition', newPosition);
                this.update(newPosition,
                    new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), event.data.ray.direction),
                    true,
                    0
                );
            }
        });

        this.mouseActionController.once(ActionControllerEventName.buttonUp, null, (event) => {
            if (this.enabled) {
                if (this.currentObject) this.forceRelease();
                this.controls.enabled = true;
            }
        });
    }

    on(eventName: PickingControllerEventNames, mesh, callback1: Function, callback2?: Function) {
        this.mouseActionController.on(ActionControllerEventName.buttonDown, mesh, (event) => {
            if (this.enabled) {
                const intersectedEventsObjects = this.getIntersectsFromRay(event.data.ray, this.getEventObjects());
                // console.log('intersectedEventsObjects = ', intersectedEventsObjectsAmount, 'newPos = ', this.getPosition(event));
                if (intersectedEventsObjects.length !== 0 && this.checkDistance(intersectedEventsObjects)) {
                    // console.log('this.currentValues',this.currentValues);
                    this.controls.enabled = false;
                    this.forcePickUp(intersectedEventsObjects[0].object, intersectedEventsObjects[0].distance, this.getPosition(event), new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), event.data.ray.direction), 0);
                }
            }
        });
        super.on(eventName, mesh, callback1, callback2);
    }

    protected onObjectPick(pickedObject: Object3D) {
        this.currentObject = pickedObject;
        this.currentObject.userData.oldRaycast = this.currentObject.raycast;
        this.currentObject.raycast = () => {
        };
    }

    protected onObjectRelease() {
        this.currentObject.raycast = this.currentObject.userData?.oldRaycast;
        this.currentObject = null;
    }

    private getEventObjects() {
        return this.events.map(el => el.mesh);
    }

    private getIntersectsFromRay(ray: Ray, objectsToRaycast?: Array<Object3D>): Array<Intersection> {
        const raycaster = new Raycaster();
        raycaster.set(ray.origin, ray.direction);
        if (objectsToRaycast) {
            return raycaster.intersectObjects(objectsToRaycast, false);
        }
        return raycaster.intersectObject(this.scene, true);
    }

    private getPosition(event: ActionControllerEvent) {
        this.updateDistance(event);

        const position = new Vector3();
        position.copy(event.data.ray.origin.clone().add(event.data.ray.direction.clone().multiplyScalar(this.lastDistance * this.config.offSet)));
        return position;
    }

    // forcePickUp(object: Object3D, distance: number, newPosition: Vector3, newRotation: Quaternion, controllerNumber?: number): void {
    //     super.forcePickUp(object, distance, newPosition, newRotation, controllerNumber);
    //     if (this.enabled) this.currentObject = object;
    // }

    private updateDistance(event: ActionControllerEvent) {
        if (this.currentObject && typeof this.currentObject.userData.pickingMoveDistance === 'number') {
            this.lastDistance = this.currentObject.userData.pickingMoveDistance;
        } else {
            const intersects = this.getIntersectsFromRay(event.data.ray);
            const toPoint = intersects[0]?.distance;
            const currentConfig = {
                maxPickingDistance: this.config.maxPickingDistance,
                minPickingDistance: this.config.minPickingDistance,
            };
            if (this.currentObject && this.currentObject.userData.pickingConfig) {
                currentConfig.maxPickingDistance = typeof this.currentObject.userData.pickingConfig.maxPickingDistance === 'number' ? this.currentObject.userData.pickingConfig.maxPickingDistance : currentConfig.maxPickingDistance;
                currentConfig.minPickingDistance = typeof this.currentObject.userData.pickingConfig.minPickingDistance === 'number' ? this.currentObject.userData.pickingConfig.minPickingDistance : currentConfig.minPickingDistance;
            }
            if (toPoint < currentConfig.maxPickingDistance && toPoint > currentConfig.minPickingDistance) {
                this.lastDistance = toPoint;
            }
        }
    }

    private checkDistance(intersects: Array<Intersection>, intersectIndex?: number): boolean {
        const currentIndex = intersectIndex || 0;
        const currentObject = intersects[currentIndex]?.object;
        if (currentObject) {
            const toPoint = intersects[currentIndex]?.distance;
            const currentConfig = {
                maxPickingDistance: this.config.maxPickingDistance,
                minPickingDistance: this.config.minPickingDistance,
            };
            if (currentObject.userData.pickingConfig) {
                currentConfig.maxPickingDistance = typeof currentObject.userData.pickingConfig.maxPickingDistance === 'number' ?
                    currentObject.userData.pickingConfig.maxPickingDistance :
                    currentConfig.maxPickingDistance;
                currentConfig.minPickingDistance = typeof currentObject.userData.pickingConfig.minPickingDistance === 'number' ?
                    currentObject.userData.pickingConfig.minPickingDistance :
                    currentConfig.minPickingDistance;
            }
            return toPoint <= currentConfig.maxPickingDistance && toPoint >= currentConfig.minPickingDistance;
        } else {
            return false;
        }
    }
}