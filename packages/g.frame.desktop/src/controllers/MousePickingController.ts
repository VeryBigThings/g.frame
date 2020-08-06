import {IPickingControllerConfig, PickingController} from '@verybigthings/g.frame.common.picking_controller';
import {MouseActionController} from './MouseActionController';
import {ActionControllerEvent, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import {Vector3, Quaternion, Scene, Raycaster, Ray, Object3D, Intersection, Box3, Mesh} from 'three';
import {OrbitControls} from '..';


export class MousePickingController extends PickingController {
    private lastDistance: number;
    private controls: OrbitControls;
    private currentObject: Object3D;
    private scene: Scene;
    private moveCallback: Function;

    constructor(protected data: any, protected config: IPickingControllerConfig, protected mouseActionController: MouseActionController) {
        super(config);
        this.scene = data.viewer.scene;
    }

    init(controls: OrbitControls) {
        this.lastDistance = this.config.maxPickingDistance;
        this.controls = controls;
        this.mouseActionController.on(ActionControllerEventName.buttonDown, null, (event) => {
            if (this.enabled) {
                const intersectedEventsObjectsAmount = this.getIntersectsFromRay(event.data.ray, this.getEventObjects());
                // console.log('intersectedEventsObjects = ', intersectedEventsObjectsAmount, 'newPos = ', this.getPosition(event));
                if (intersectedEventsObjectsAmount.length !== 0) {
                    // console.log('this.currentValues',this.currentValues);
                    this.controls.enabled = false;
                    this.forcePickUp(intersectedEventsObjectsAmount[0].object, intersectedEventsObjectsAmount[0].distance, this.getPosition(event), new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), event.data.ray.direction), 0);
                }
            }
        });

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

    getEventObjects() {
        return this.events.map(el => el.mesh);
    }

    getIntersectsFromRay(ray: Ray, objectsToRaycast?: Array<Object3D>): Array<Intersection> {
        const raycaster = new Raycaster();
        raycaster.set(ray.origin, ray.direction);
        if (objectsToRaycast) {
            return raycaster.intersectObjects(objectsToRaycast, false);
        }
        return raycaster.intersectObject(this.scene, true);
    }

    getPosition(event: ActionControllerEvent) {
        this.updateDistance(event);

        const position = new Vector3();
        position.copy(event.data.ray.origin.clone().add(event.data.ray.direction.clone().multiplyScalar(this.lastDistance - 0.5)));
        return position;
    }

    updateDistance(event: ActionControllerEvent) {
        if (this.currentObject && typeof this.currentObject.userData.pickingDistance === 'number') {
            this.lastDistance = this.currentObject.userData.pickingDistance;
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
}