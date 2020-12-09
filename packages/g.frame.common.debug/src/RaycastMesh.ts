import {Object3D, Raycaster, Scene} from 'three';
import {ActionController, ActionControllerEvent, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';

export default class RaycastMesh {
    private actionController: ActionController;
    private scene: Scene;
    private inited: boolean = false;
    private raycastedViewerModules: any = 0;
    private raycastedMeshes: any = 0;

    constructor() {}

    init(actionController: ActionController, scene: Scene) {
        this.actionController = actionController;
        this.scene = scene;
    }

    raycastViewerModule(callback?: (ViewerModule) => void) {
        this.raycastMesh((object: Object3D) => {
            while (object && !object.userData.viewerModule) {
                object = object.parent;
            }
            if (object) {
                console.log(`%cClicked ViewerModule is vm${++this.raycastedViewerModules}`, 'color: green;', object.userData.viewerModule);
                window[`vm${this.raycastedViewerModules}`] = object.userData.viewerModule;
                if (callback) callback(object.userData.viewerModule);
            } else {
                console.log(`%cNo ViewerModule was found...`, 'color: red;');
            }
        });
    }

    raycastMesh(callback?: (Mesh) => void) {
        if (!this.inited) {
            console.warn('raycastMesh used before init');
            return;
        }
        this.actionController.once(ActionControllerEventName.buttonUp, null, (event: ActionControllerEvent) => {
            const raycaster = new Raycaster();
            // @ts-ignore
            raycaster.ray.copy(event.data.ray);
            const intersects = raycaster.intersectObject(this.scene, true);
            if (intersects.length) {
                if (callback) callback(intersects[0].object);
                else {
                    console.log(`%cClicked Mesh is mesh${++this.raycastedMeshes}`, 'color: green;', intersects[0].object);
                    window[`mesh${this.raycastedMeshes}`] = intersects[0].object;
                }
            } else {
                console.log(`%cNo meshes was found...`, 'color: red;');
            }
        });
    }

}