import {IPickingControllerConfig, PickingController} from '@verybigthings/g.frame.common.picking_controller';
import {MouseActionController} from './MouseActionController';
import {ActionControllerEvent, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import {Vector3, Quaternion, Scene, Raycaster, Ray, Object3D, Intersection, Box3} from 'three';
import {OrbitControls} from '..';


export class MousePickingController extends PickingController {
    private isSqueezed: boolean = false;
    private lastDistance: number;
    private currentObject: Object3D;
    private scene: Scene;

    constructor(protected data: any, protected config: IPickingControllerConfig, protected mouseActionController: MouseActionController, protected controls: OrbitControls) {
        super(config);
        this.lastDistance = this.config.maxPickingDistance;
        this.scene = data.viewer.scene;

            this.mouseActionController.on(ActionControllerEventName.buttonDown, null, (event) => {
            const eventObjects = this.events.map(el => el.mesh);
            const intersectedEventsObjects = this.getIntersectedObjects(event.data.ray).find(intersect => eventObjects.find(draggable => draggable === intersect.object));
           if (intersectedEventsObjects) {
               console.log('intersectedEventsObjects', intersectedEventsObjects);
           // if (this.getIntersectedObjects(event.data.ray)[0]) {
               this.isSqueezed = true;
               this.controls.enabled = false;
           }
        });
        this.mouseActionController.on(ActionControllerEventName.buttonUp, null, (event) => {
            this.isSqueezed = false;
            this.controls.enabled = true;
        });
        this.mouseActionController.on(ActionControllerEventName.move, null, (event) => {
            const newPosition = this.getPosition(event);
            console.log('position', newPosition, new Quaternion().setFromUnitVectors(event.data.ray.origin, event.data.ray.direction),);
            this.update(newPosition,
                new Quaternion(),
                this.isSqueezed,
                0
            );
        });
    }

    getIntersectedObjects(ray: Ray): Array<Intersection> {
        const raycaster = new Raycaster();
        raycaster.set(ray.origin, ray.direction);
        return raycaster.intersectObject(this.scene, true);
    }

    getPosition(event: ActionControllerEvent) {
        const position = new Vector3();

        const intersects = this.getIntersectedObjects(event.data.ray);

        const objectSize = new Vector3();
        if (this.currentObject) {
            const objectBox = new Box3();
            objectBox.setFromObject(this.currentObject);
            objectBox.getSize(objectSize);
        }

        if (intersects[0]) {
            if (intersects.length === 0 || intersects[0].distance > this.config.maxPickingDistance || intersects[0].distance < this.config.minPickingDistance) {
                position.z = this.lastDistance;
            } else {
                this.lastDistance = intersects[0].distance - objectSize.z / 2;
                position.z = this.lastDistance;
            }

            position.setX(intersects[0].point.x);
            position.setY(intersects[0].point.y);
        }

        return position;
    }

    protected onObjectPick(pickedObject: Object3D) {
        this.currentObject = pickedObject;
        this.currentObject.userData.oldRaycast = this.currentObject.raycast;
        this.currentObject.raycast = null;
    }

    protected onObjectRelease() {
        this.currentObject.raycast = this.currentObject.userData?.oldRaycast?;
        this.currentObject = null;
    }
}