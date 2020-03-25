import {EventDispatcher, ParentEvent} from './EventDispatcher';
import {Box3, Camera, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Texture, Vector2, Vector3} from 'three';
// import {ActionController} from '../controls/action_controller/ActionController';
// import {CardMesh, IDisposeParams} from '../interfaces';
// import {OrbitControls} from '../controls/OrbitControls';
// import {VRControls} from '../controls/vr_controls/VRControls';
// import {ResourceRaw} from '../utils/loaders/ResourcesManager';

interface IDisposeParams {
    geometry: boolean;
    material: boolean;
    maps: boolean;
    actions: boolean;
    viewer: boolean;
}

export class ViewerModule extends EventDispatcher<string> {
    public camera: Camera;

    // public actionController: ActionController;
    // public vrControls: VRControls;
    // public controls: OrbitControls;
    // public resourcesInUse: Array<ResourceRaw> = [];

    public uiObject: Object3D;
    public isViewer: boolean = true;
    private disposeObjects: Array<any>;

    constructor() {
        super();
        this.uiObject = new Object3D;
        this.uiObject.name = 'UI Object';
        this.uiObject.userData.viewerModule = this;

        this.disposeObjects = [];
    }

    /**
     * Function to get world position of this ViewerModule
     * @return {Vector3} Global position
     */
    getGlobalPosition(): Vector3 {
        return this.uiObject.localToWorld(new Vector3());
    }

    /**
     * Function to add new mesh to uiObject, to automatize that disposing
     * @param {Mesh|ViewerModule} object
     * @param {IDisposeParams} disposeParams What need to be disposed in mesh, when viewer is disposing
     * @param {boolean} [disposeParams.geometry=true] Need to dispose geometry of the object
     * @param {boolean} [disposeParams.material=true] Need to dispose material of the object
     * @param {boolean} [disposeParams.maps=false] Need to dispose maps in the material of the object
     * @param {boolean} [disposeParams.actions=true] Need to off actions in action controller for current object
     * @param {boolean} [disposeParams.viewer=true] Need to dispose curent Viewer.
     * @param {Object3D} parentObject=this.uiObject Where to add object. By default it is uiObject of the ViewerModule
     * @return {Mesh|ViewerModule} object
     */
    addObject(object, disposeParams?: IDisposeParams, parentObject: Object3D = this.uiObject) {
        disposeParams = disposeParams || {
            geometry: true,
            material: true,
            maps: false,
            actions: true,
            viewer: true
        };

        this.disposeObjects.push({
            object: object,
            disposeGeometry: disposeParams.geometry,
            disposeMaterial: disposeParams.material,
            disposeMaps: disposeParams.maps,
            disposeActions: disposeParams.actions,
            disposeViewer: disposeParams.viewer,
        });

        parentObject.add(object.isViewer ? object.uiObject : object);

        return object;
    }

    /**
     * Function to remove mesh from uiObject
     * @param {Mesh|ViewerModule} object
     */
    removeObject(object) {
        for (let i = this.disposeObjects.length - 1; i >= 0; i--) {
            if (object === this.disposeObjects[i].object) {
                this.disposeObjects.splice(i, 1);
            }
        }

        const mesh = object.isViewer ? object.uiObject : object;
        mesh.parent && mesh.parent.remove(mesh);
    }

    /**
     * Function to dispose mesh and remove it from uiObject
     * @param object
     * @param disposeParams
     */
    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any) {
        const dispose = (disposeDescriptor) => {
            disposeDescriptor.disposeGeometry && disposeDescriptor.object.geometry && disposeDescriptor.object.geometry.dispose();
            disposeDescriptor.disposeMaps && disposeDescriptor.object.material && disposeDescriptor.object.material.map && disposeDescriptor.object.material.map.dispose();
            disposeDescriptor.disposeMaterial && disposeDescriptor.object.material && disposeDescriptor.object.material.dispose();
            // disposeDescriptor.disposeActions && this.actionController.off(null, disposeDescriptor.object);
            disposeDescriptor.disposeViewer && disposeDescriptor.object.isViewer && disposeDescriptor.object.dispose();
        };

        if (object) {
            for (let i = 0, length = this.disposeObjects.length; i < length; i++) {
                const disposeDescriptor = this.disposeObjects[i];
                if (object === disposeDescriptor.object) {
                    dispose(disposeDescriptor);
                    break;
                }
            }
        } else {
            object = disposeParams.object;
            dispose(disposeParams);
        }

        this.fire('dispose', new ParentEvent<string>('dispose', {
            disposedObject: object
        }));

        this.removeObject(object);
    }

    /**
     * Update function to call in each frame
     */
    update() {
        // this.uiObject.lookAt(this.camera.localToWorld(new Vector3()));
    }

    /**
     * Automatized dispose function, works with objects, that are added with addObject function
     */
    dispose() {
        this.disposeObjects.forEach(disposeDescriptor => {
            this.disposeObject(null, disposeDescriptor);
        });
        this.fire('dispose', new ParentEvent<string>('dispose', {
            disposedObject: this
        }));
    }
}

