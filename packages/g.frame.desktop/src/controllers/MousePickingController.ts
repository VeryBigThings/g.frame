import {IPickingControllerConfig, PickingController} from '@verybigthings/g.frame.common.picking_controller';
import {MouseActionController} from './MouseActionController';
import {ActionControllerEvent, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import {Vector3, Quaternion, Scene, Raycaster, Ray, Object3D, Intersection} from 'three';
import {OrbitControls} from '..';


export class MousePickingController extends PickingController {
    private isSqueezed: boolean = false;
    private lastDistance: number;
    private scene: Scene;

    constructor(protected data: any, protected config: IPickingControllerConfig, protected mouseActionController: MouseActionController, protected controls: OrbitControls) {
        super(config);
        this.config.maxPickingDistance = this.config.maxPickingDistance || 50;
        this.config.minPickingDistance = this.config.minPickingDistance || .001;
        this.lastDistance = this.config.maxPickingDistance;
        this.scene = data.viewer.scene;

        this.mouseActionController.on(ActionControllerEventName.buttonDown, null, (event) => {
           // if (this.getIntersectedObjects(event.data.ray).find(intersect => this.draggables.find(draggable => draggable === intersect))) {
           if (this.getIntersectedObjects(event.data.ray)[0]) {
               this.isSqueezed = true;
               this.controls.enabled = false;
           }
        });
        this.mouseActionController.on(ActionControllerEventName.buttonUp, null, (event) => {
            this.isSqueezed = false;
            this.controls.enabled = true;
        });
        this.mouseActionController.on(ActionControllerEventName.move, null, (event) => {
            this.update(this.getPosition(event),
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

        if (intersects[0]) {
            console.log('intersects', intersects);

            if (intersects.length === 0 || intersects[0].distance > this.config.maxPickingDistance || intersects[0].distance < this.config.minPickingDistance) {
                position.z = this.lastDistance;
            } else {
                this.lastDistance = intersects[0].distance;
                position.z = this.lastDistance;
            }

            position.setX(intersects[0].point.x);
            position.setY(intersects[0].point.y);
        }

        return position;
    }
}