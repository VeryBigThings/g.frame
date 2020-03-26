import {Group, Intersection, Mesh, Object3D, Ray, Raycaster, Scene, Vector3} from 'three';
import {MeshEventDescriptor, MeshEventDispatcher} from '../core/MeshEventDispatcher';
import {ParentEvent} from '../core/EventDispatcher';


export enum ActionControllerEventName {
    buttonUp = 'buttonUp',
    buttonDown = 'buttonDown',
    move = 'move',
    click = 'click',
    over = 'over',
    out = 'out'
}

export class ActionControllerEvent extends ParentEvent<string> {
    constructor(public eventName: string, public data: {
        intersection?: IntersectionExt,
        controllerNumber: number,
        context: ActionController,
        ray: Ray
    }) {
        super(eventName, data);
    }
}

/**
 * Intersection Extended interface saves information about intersected Mesh,
 * during raycasting Object3D with recursion flag
 */
export interface IntersectionExt extends Intersection {
    objectIntersected?: Object3D;
    orderNumber?: number;
}

/**
 * ActionController class provides easy THREE.Mesh events listeners.
 * Use next events for callbacks 'buttonDown', 'move', 'buttonUp', 'over', 'out', 'click'
 */
export class ActionController extends MeshEventDispatcher {
    /**
     * @ignore
     */
    public __agentConstructor: Function;

    private buttonDownRayDirections: Array<Vector3> = [];

    /**
     * Constructor of the ActionController
     */
    constructor() {
        super();
    }

    /**
     * Function, that checks if object has invisible parents in it's parent tree.
     * Also works to check if object isn't attached (isn't child of) to scene.
     * @param object Instance of Object3D to test
     * @returns True in next cases: some of parents are invisible or latest parent isn't Scene.
     * False in next case: all parents are visible and the latest parent is instance of Scene.
     */
    static hasInvisibleParent(object: Object3D): boolean {
        while (object.parent !== null) {
            if (!object.visible) return true;
            object = object.parent;
        }
        if (!object.visible) return true;
        return !(object instanceof Scene);
    }

    /**
     * Function to check whether was click with the hardcoded precision
     * @param eventName Current event name
     * @param buttonDownRayDirections Array of ray directions, when button down was fired for all controllers
     * @param direction Current direction
     * @param controllerNumber Which controller is in use
     * @returns Was click or not
     */
    static checkClick(eventName: ActionControllerEventName, buttonDownRayDirections: Array<Vector3>, direction: Vector3, controllerNumber: number): boolean {
        if (eventName === ActionControllerEventName.buttonUp
            && buttonDownRayDirections[controllerNumber]
            && new Vector3().subVectors(direction, buttonDownRayDirections[controllerNumber]).length() < 0.02) {
            buttonDownRayDirections[controllerNumber] = null;
            return true;
        }
        if (eventName === ActionControllerEventName.buttonDown) buttonDownRayDirections[controllerNumber] = direction.clone();
        return false;
    }

    /**
     * Function to get array of objects to raycast.
     * @param eventName Selected event name
     * @param events Array of events from [[ActionController]]
     * @param wasClick Information about click. Check function [[ActionController.checkClick]]
     * @returns Filtered array of Object3D instances
     */
    static getObjectsToRaycast(eventName: ActionControllerEventName, events: Array<MeshEventDescriptor>, wasClick: boolean): Array<Object3D> {
        return [...new Set(events
            .filter(event =>
                (event.eventName === eventName
                    || (eventName === ActionControllerEventName.move
                        && (event.eventName === ActionControllerEventName.over || event.eventName === ActionControllerEventName.out))
                    || (wasClick && event.eventName === ActionControllerEventName.click)) && event.mesh)
            .map(event => event.mesh))];
    }

    /**
     * Function that is used by ActionController to raycast objects.
     * It raycasts Meshes with non-recursive flag and Groups and simple Object3Ds with recursive.
     * Result is already sorted by distance
     * @param objectsToRaycast Array of Object3D instances. Works well with Object3D, Group and Mesh.
     * @param raycaster Defined raycaster, that is used. Don't forget to set .ray of it.
     * @returns Sorted array of intersections.
     * Every intersections has property of objectIntersected, if recursion was used.
     */
    static raycastObjects(objectsToRaycast: Array<Object3D>, raycaster: Raycaster): Array<IntersectionExt> {
        const intersectsRecursive = objectsToRaycast
            .filter(mesh => !(mesh instanceof Mesh) && (mesh.isObject3D || mesh instanceof Group))
            .map(object => {
                const intersection: IntersectionExt = raycaster.intersectObject(object, true)[0];
                if (intersection) {
                    intersection.objectIntersected = intersection.object;
                    intersection.object = object;
                }
                return intersection;
            })
            .filter(object => object);

        return raycaster
            .intersectObjects(objectsToRaycast.filter(mesh => mesh instanceof Mesh), false, intersectsRecursive)
            .sort((a, b) => a.distance - b.distance)
            .map((el: IntersectionExt, i) => {
                el.orderNumber = i;
                return el;
            });
    }

    /**
     * Override of the MeshEventDispatcher.fire function to use
     *      ActionControllerEventName as eventName
     *      ActionControllerEvent as event
     * Set's also internal info to mesh.userData
     * @param eventName
     * @param mesh
     * @param event
     */
    fire(eventName: ActionControllerEventName, mesh?: Object3D, event?: ActionControllerEvent) {
        super.fire(eventName, mesh, event);
        if (!mesh) return;

        if (eventName === ActionControllerEventName.buttonDown) mesh.userData.isButtonDown[event.data.controllerNumber] = true;
        if (eventName === ActionControllerEventName.buttonUp) mesh.userData.isButtonDown[event.data.controllerNumber] = false;

        if (eventName === ActionControllerEventName.over) mesh.userData.isOver[event.data.controllerNumber] = true;
        if (eventName === ActionControllerEventName.out) mesh.userData.isOver[event.data.controllerNumber] = false;
    }

    /**
     * Override of the MeshEventDispatcher.on function to use only ActionControllerEventName as eventName
     * Adds next arrays to mesh.userData (if mesh is presented):
     * ```typescript
     * mesh.userData.isButtonDown = [];
     * mesh.userData.isOver = [];
     * ```
     * @param eventName
     * @param mesh
     * @param callback1 callback or condition if callback2 is defined
     * @param callback2 callback if condition callback1 is defined
     */
    on(eventName: ActionControllerEventName, mesh?: Object3D, callback1?: Function, callback2?: Function) {
        if (mesh instanceof Object3D) {
            !mesh.userData.isButtonDown && (mesh.userData.isButtonDown = []);
            !mesh.userData.isOver && (mesh.userData.isOver = []);
        }
        super.on(eventName, mesh, callback1, callback2);
    }

    /**
     * Override of the MeshEventDispatcher.on function to use only ActionControllerEventName as eventName
     * Adds next arrays to mesh.userData (if mesh is presented):
     * ```typescript
     * mesh.userData.isButtonDown = [];
     * mesh.userData.isOver = [];
     * ```
     * @param eventName
     * @param mesh
     * @param callback1 callback or condition if callback2 is defined
     * @param callback2 callback if condition callback1 is defined
     */
    once(eventName: ActionControllerEventName, mesh?: Object3D, callback1?: Function, callback2?: Function) {
        if (mesh instanceof Object3D) {
            !mesh.userData.isButtonDown && (mesh.userData.isButtonDown = []);
            !mesh.userData.isOver && (mesh.userData.isOver = []);
        }
        super.on(eventName, mesh, callback1, callback2);
    }

    /**
     * Override of the MeshEventDispatcher.off function to use only ActionControllerEventName as eventName
     * @param eventName
     * @param mesh
     * @param callback
     */
    off(eventName?: ActionControllerEventName, mesh?: Object3D, callback?: Function) {
        super.off(eventName, mesh, callback);
    }

    /**
     * Function to raycast and fire events of the meshes
     * @param eventName Event name to raycast
     * @param raycaster Raycaster with defined ray.
     * You can define raycaster from origin point and quaternion using next code:
     * ```typescript
     * // quaternion: Quaternion and position: Vector3 are defined.
     * const direction = new Vector3(0, 0, -1).applyQuaternion(quaternion);
     * const raycaster = new Raycaster();
     * raycaster.ray.set(position, direction);
     * ```
     * @param controllerNumber Controller number from where event was fired. Use 0 for left, 1 for right.
     * For all another with undefined handness use 0 also.
     */
    protected update(eventName: ActionControllerEventName, raycaster: Raycaster, controllerNumber: number = 0): void {
        const wasClick = ActionController.checkClick(eventName, this.buttonDownRayDirections, raycaster.ray.direction, controllerNumber);

        this.fire(eventName, null, new ActionControllerEvent(eventName, {
            controllerNumber: controllerNumber,
            context: this,
            ray: raycaster.ray.clone()
        }));

        const objectsToRaycast = ActionController
            .getObjectsToRaycast(eventName, this.events, wasClick)
            .filter(object => !ActionController.hasInvisibleParent(object));

        const intersects = ActionController.raycastObjects(objectsToRaycast, raycaster);
        const objectsIntersected = [];

        let ignoredObjects = 0, index = 0, intersectsLength = intersects.length;

        for (index = 0; index < intersectsLength; index++) {
            [eventName, wasClick ? ActionControllerEventName.click : null]
                .forEach(firingEventName => firingEventName && this.fire(
                    firingEventName,
                    intersects[index].object,
                    new ActionControllerEvent(firingEventName, {
                        intersection: intersects[index],
                        controllerNumber: controllerNumber,
                        context: this,
                        ray: raycaster.ray.clone()
                    })
                ));
            objectsIntersected.push(intersects[index].object);
        }

        for (index = 0; index < this.events.length; index++) {
            const event = this.events[index];

            if (!event.mesh) continue;
            // Button up was already not over object
            if (eventName === ActionControllerEventName.buttonUp
                && event.eventName === ActionControllerEventName.buttonUp
                && event.mesh.userData.isButtonDown[controllerNumber]
                && !ActionController.hasInvisibleParent(event.mesh)
                && objectsIntersected.indexOf(event.mesh) === -1)
                this.fire(eventName, event.mesh, new ActionControllerEvent(eventName, {
                    controllerNumber: controllerNumber,
                    context: this,
                    ray: raycaster.ray.clone()
                }));

            // Check for over and out extended events
            if (eventName === ActionControllerEventName.move) {

                // Check if there is over event
                if (event.eventName === ActionControllerEventName.over
                    && !event.mesh.userData.isOver[controllerNumber]) {
                    const intersection = intersects.find(intersectionEl => intersectionEl.object === event.mesh);
                    if (intersection) {
                        this.fire(ActionControllerEventName.over, intersection.object,
                            new ActionControllerEvent(ActionControllerEventName.over, {
                                intersection: intersection,
                                controllerNumber: controllerNumber,
                                context: this,
                                ray: raycaster.ray.clone()
                            })
                        );
                    }
                }

                // Check if there is out event
                if (event.eventName === ActionControllerEventName.out
                    && event.mesh.userData.isOver[controllerNumber]) {
                    this.fire(ActionControllerEventName.out, event.mesh, new ActionControllerEvent(ActionControllerEventName.out, {
                        controllerNumber: controllerNumber,
                        context: this,
                        ray: raycaster.ray.clone()
                    }));
                }
            }
        }
    }
}
