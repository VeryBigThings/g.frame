import {Intersection, Matrix4, Object3D, Quaternion, Raycaster, Vector3} from 'three';
import {MeshEventDispatcher, ParentEvent} from '@verybigthings/g.frame.core';
import {
    IPickingControllerCurrentValue,
    IPickingControllerConfig,
} from './interfaces';

export enum PickingControllerEventNames {
    PICKED = 'picked', MOVED = 'moved', RELEASED = 'released'
}

export class PickingController extends MeshEventDispatcher {
    /**
     * @ignore
     */
    public __agentConstructor: Function;
    public enabled: boolean;
    protected currentValues: Array<IPickingControllerCurrentValue> = [];

    constructor(protected config: IPickingControllerConfig) {
        super();
        for (let i = 0; i < this.config.controllersQuantity; i++) {
            this.currentValues.push({
                currentPickedObject: null,
                raycaster: new Raycaster(),
                intersectionDistance: 0,
                startScale: new Vector3(),
                startOffset: new Vector3(),
                startRotation: new Quaternion(),
            });
        }

        this.updateRaycaster();
    }

    public updateRaycaster() {
        this.currentValues.forEach(element => {
            element.raycaster.near = this.config.minPickingDistance;
            element.raycaster.far = this.config.maxPickingDistance;
        });
    }

    on(eventName: PickingControllerEventNames, mesh, callback1: Function, callback2?: Function) {
        super.on(eventName, mesh, callback1, callback2);
    }

    once(eventName: PickingControllerEventNames, mesh, callback1: Function, callback2?: Function): any {
        return super.once(eventName, mesh, callback1, callback2);
    }

    fire(eventName?: PickingControllerEventNames, mesh?: Object3D, data: ParentEvent<string> = new ParentEvent<string>('')) {
        super.fire(eventName, mesh, data);
    }

    off(eventName?: PickingControllerEventNames, mesh?: Object3D, callback?: Function) {
        super.off(eventName, mesh, callback);
    }

    forcePickUp(object: Object3D, distance: number, newPosition: Vector3, newRotation: Quaternion, controllerNumber: number = 0) {
        if (!this.enabled) return;

        const scope = this.currentValues[controllerNumber];
        const direction = new Vector3(0, 0, -1).applyQuaternion(newRotation);

        scope.currentPickedObject = object;
        scope.intersectionDistance = distance;

        const quat = new Quaternion();
        const sposition = new Vector3();
        scope.currentPickedObject.matrixWorld.decompose(sposition, quat, scope.startScale);
        quat.inverse();
        const matrix = new Matrix4();
        matrix.makeRotationFromQuaternion(quat);

        const objectPosition = new Vector3(0.0, 0.0, 0.0);
        objectPosition.applyMatrix4(scope.currentPickedObject.matrixWorld);
        const stylusEnd = new Vector3();
        stylusEnd.copy(newPosition);
        stylusEnd.addScaledVector(direction, distance);

        const offset = new Vector3();
        offset.subVectors(objectPosition, stylusEnd);
        scope.startOffset.copy(offset);
        scope.startOffset.applyMatrix4(matrix);

        const rotation = new Quaternion();
        rotation.copy(newRotation);
        rotation.inverse();

        scope.currentPickedObject.matrixWorld.decompose(sposition, quat, scope.startScale);
        scope.startRotation.multiplyQuaternions(rotation, quat);

        this.fire(PickingControllerEventNames.PICKED, scope.currentPickedObject, new ParentEvent<string>('picked', {
            scope: scope,
            controllerNumber: controllerNumber
        }));

        this.onObjectPick(object);
        this.update(newPosition, newRotation, true, controllerNumber);
    }

    forceRelease(controllerNumber: number = 0) {
        if (!this.enabled) return;
        const scope = this.currentValues[controllerNumber];
        this.fire(PickingControllerEventNames.RELEASED, scope.currentPickedObject, new ParentEvent<string>('released', {
            scope: scope,
            controllerNumber: controllerNumber
        }));
        scope.currentPickedObject = null;
        this.onObjectRelease();
    }

    protected update(newPosition: Vector3, newRotation: Quaternion, isSqueezed: boolean, controllerNumber: number) {
        const scope = this.currentValues[controllerNumber];
        const direction = new Vector3(0, 0, -1).applyQuaternion(newRotation);
        if (scope.currentPickedObject) {
            if (isSqueezed) {
                // Just updating picked object position and rotation
                // If the button state hasn't changed, but we are dragging, we need to
                // process the drag operation.
                const stylusEnd = new Vector3();
                stylusEnd.copy(newPosition);
                stylusEnd.addScaledVector(direction, scope.intersectionDistance);
                const rotation = newRotation;
                const _newRotation = new Quaternion();
                _newRotation.multiplyQuaternions(rotation, scope.startRotation);

                const matrix = new Matrix4();
                matrix.makeRotationFromQuaternion(_newRotation);
                const offset = new Vector3();
                offset.copy(scope.startOffset);
                offset.applyMatrix4(matrix);

                // Set the modelview matrix to be the new rotation and offset as calculated above.
                const newOffset = new Vector3();
                newOffset.addVectors(offset, stylusEnd);

                const newScale = new Vector3();
                newScale.copy(scope.startScale);

                if (scope.currentPickedObject.parent != null) {
                    const parentTransform = new Matrix4();
                    const newTransform = new Matrix4();
                    const localTransform = new Matrix4();

                    parentTransform.getInverse(scope.currentPickedObject.parent.matrixWorld);
                    newTransform.compose(newOffset, newRotation, scope.startScale);
                    localTransform.multiplyMatrices(parentTransform, newTransform);
                    localTransform.decompose(newOffset, newRotation, newScale);
                }

                scope.currentPickedObject.position.copy(newOffset);
                scope.currentPickedObject.quaternion.copy(_newRotation);
                scope.currentPickedObject.scale.copy(newScale);
                scope.currentPickedObject.updateMatrix();
                scope.currentPickedObject.updateMatrixWorld();
                this.fire(PickingControllerEventNames.MOVED, scope.currentPickedObject, new ParentEvent<string>('moved', {
                    scope: scope,
                    controllerNumber: controllerNumber
                }));
                this.onObjectMove();
            } else {
                // Releasing picked object, firing event
                this.fire(PickingControllerEventNames.RELEASED, scope.currentPickedObject, new ParentEvent<string>('released', {
                    scope: scope,
                    controllerNumber: controllerNumber
                }));
                scope.currentPickedObject = null;
                this.onObjectRelease();
            }
        } else {
            let objectsToRaycast = [...new Set(this.events
                .map(el => el.object)
                .filter(object => {
                    return object && this.currentValues.map(el => el.currentPickedObject).indexOf(object) === -1;
                })
            )];
            scope.raycaster.ray.set(newPosition, direction);
            const intersection = scope.raycaster.intersectObjects(objectsToRaycast)[0];
            if (intersection) {
                if (isSqueezed) {
                    // Picking object
                    scope.intersectionDistance = intersection.distance;
                    scope.currentPickedObject = intersection.object;

                    // This code figures out the beginning offset and from the end
                    // of the virtual stylus and the center of the grabbed object.
                    // It also computes the starting cumulative rotation of the stylus
                    // and the grabbed object.  These will be used to compute the correct
                    // modelview transform of the object while it is dragged.
                    const quat = new Quaternion();
                    const sposition = new Vector3();
                    scope.currentPickedObject.matrixWorld.decompose(sposition, quat, scope.startScale);
                    quat.inverse();
                    const matrix = new Matrix4();
                    matrix.makeRotationFromQuaternion(quat);

                    const objectPosition = new Vector3(0.0, 0.0, 0.0);
                    objectPosition.applyMatrix4(scope.currentPickedObject.matrixWorld);
                    const stylusEnd = new Vector3();
                    stylusEnd.copy(newPosition);
                    stylusEnd.addScaledVector(direction, intersection.distance);

                    const offset = new Vector3();
                    offset.subVectors(objectPosition, stylusEnd);
                    scope.startOffset.copy(offset);
                    scope.startOffset.applyMatrix4(matrix);

                    const rotation = new Quaternion();
                    rotation.copy(newRotation);
                    rotation.inverse();

                    scope.currentPickedObject.matrixWorld.decompose(sposition, quat, scope.startScale);
                    scope.startRotation.multiplyQuaternions(rotation, quat);

                    this.fire(PickingControllerEventNames.PICKED, scope.currentPickedObject, new ParentEvent<string>('picked', {
                        scope: scope,
                        controllerNumber: controllerNumber
                    }));

                    this.onObjectPick(intersection.object);
                } else {
                    // Just moving stylus around
                    this.onEmptyControllerMove(intersection);
                }
            } else {
                this.onEmptyControllerMove();
            }
        }
    }

    protected onObjectPick(pickedObject: Object3D) {
    }

    protected onObjectRelease() {
    }

    protected onObjectMove() {
    }

    protected onEmptyControllerMove(intersection?: Intersection) {
    }
}


