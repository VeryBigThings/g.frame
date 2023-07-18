import {PickingController, PickingControllerEventNames} from '@g.frame/common.picking_controller';
import {MouseActionController} from './MouseActionController';
import {ActionControllerEvent, ActionControllerEventName} from '@g.frame/common.action_controller';
import {Intersection, Object3D, Quaternion, Ray, Raycaster, Scene, Vector3} from 'three';
import {OrbitControls} from '..';
import {IMousePickingControllerConfig} from '../interfaces';

export class MousePickingController extends PickingController {
    private lastDistance: number;
    private controls: OrbitControls;
    private currentObject: Object3D;
    private scene: Scene;
    private isControlsWasEnabled: boolean;
    private lastMouseMoveEvent: any;

    constructor(protected data: any, protected config: IMousePickingControllerConfig, protected mouseActionController: MouseActionController) {
        super(config);
        this.config.offSet = this.config.offSet || 0.95;
        this.scene = data.viewer.scene;
    }

    frameUpdate() {
        const event = this.lastMouseMoveEvent;
        if (this.currentObject && this.enabled && this.lastMouseMoveEvent) {
            const newPosition = this.getPosition(event);
            this.update(event.data.ray.origin.clone(),
                new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), event.data.ray.direction),
                true,
                0,
                event.data.ray.origin.distanceTo(newPosition)
            );
        }
    }

    init(controls: OrbitControls) {
        this.lastDistance = this.config.maxPickingDistance;
        this.controls = controls;

        this.mouseActionController.on(ActionControllerEventName.move, null, (event) => {
            this.lastMouseMoveEvent = event;
        });

        this.mouseActionController.on(ActionControllerEventName.buttonUp, null, (event) => {
            if (this.enabled) {
                if (this.currentObject && !this.currentObject.userData.onlyForceRelease) {
                    const newPosition = this.getPosition(event);
                    this.forceRelease(
                        event.data.ray.origin.clone(),
                        new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), event.data.ray.direction),
                        true,
                        0,
                        event.data.ray.origin.distanceTo(newPosition)
                    );
                    this.controls.enabled = this.isControlsWasEnabled;
                }
            }
        });
    }

    on(eventName: PickingControllerEventNames, mesh, callback1: Function, callback2?: Function) {
        if (eventName === PickingControllerEventNames.PICKED)
            this.mouseActionController.on(ActionControllerEventName.buttonDown, mesh, (event) => {
                if (event.data.intersection.orderNumber !== 0) return;
                if (this.enabled) {
                    const intersectedEventsObjects = this.getIntersectsFromRay(event.data.ray, [mesh]);
                    // console.log('intersectedEventsObjects = ', intersectedEventsObjectsAmount, 'newPos = ', this.getPosition(event));
                    if (intersectedEventsObjects.length !== 0 && this.checkDistance(intersectedEventsObjects)) {
                        // console.log('this.currentValues',this.currentValues);
                        this.isControlsWasEnabled = this.controls.enabled;
                        this.controls.enabled = false;
                        const position = this.getPosition(event);
                        this.forcePickUp(intersectedEventsObjects[0].object, event.data.ray.origin.distanceTo(position), event.data.ray.origin.clone(), new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), event.data.ray.direction), 0);
                    }
                }
            });
        super.on(eventName, mesh, callback1, callback2);
    }

    off(eventName: PickingControllerEventNames, mesh, callback?: Function) {
        if (eventName === PickingControllerEventNames.PICKED)
            this.mouseActionController.off(ActionControllerEventName.buttonDown, mesh);
        super.off(eventName, mesh, callback);
    }

    protected onObjectPick(pickedObject: Object3D) {
        this.currentObject = pickedObject;
        this.currentObject.traverse(obj => {
            obj.userData.oldRaycast = obj.raycast;
            obj.raycast = () => {
            };
        });

    }

    protected onObjectRelease() {
        this.currentObject.traverse(obj => {
            obj.raycast = obj.userData?.oldRaycast;
        });
        this.currentObject = null;
    }

    private getEventObjects() {
        return this.events.map(el => el.object);
    }

    private getIntersectsFromRay(ray: Ray, objectsToRaycast?: Array<Object3D>): Array<Intersection> {
        const raycaster = new Raycaster();
        raycaster.set(ray.origin, ray.direction);
        if (objectsToRaycast) {
            return objectsToRaycast.map(object => {
                const intersection = raycaster.intersectObject(<Object3D>object, true)[0];
                if (intersection) {
                    // @ts-ignore
                    intersection.intersectedObject = intersection.object;
                    intersection.object = <Object3D>object;
                }
                return intersection;
            }).filter(a => a);
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
        const _currentObject = this.currentObject || event?.data?.intersection?.object;
        if (_currentObject && typeof _currentObject.userData.pickingMoveDistance === 'number') {
            this.lastDistance = _currentObject.userData.pickingMoveDistance;
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
