import { ActionController, ActionControllerEventName } from './ActionController';
import { WebGLRenderer, Camera, Raycaster, Vector3, Vector2 } from 'three';

interface ITouchActionControllerConfig {
    controllersQuantity: number;
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class TouchActionController extends ActionController {
    protected onTouchStart: (event: TouchEvent) => void;
    protected onTouchMove: (event: TouchEvent) => void;
    protected onTouchEnd: (event: TouchEvent) => void;

    constructor(protected config: ITouchActionControllerConfig, protected renderer: WebGLRenderer, protected camera: Camera) {
        super();

        this.onTouchStart = (event: TouchEvent) => {
            event.preventDefault();
            this.update(ActionControllerEventName.buttonDown, TouchActionController.getRaycaster(config, TouchActionController.getClickPosition(<TouchEvent>event), this.camera));
        };
        this.onTouchMove = (event: TouchEvent) => {
            event.preventDefault();
            this.update(ActionControllerEventName.move, TouchActionController.getRaycaster(config, TouchActionController.getClickPosition(<TouchEvent>event), this.camera));
        };
        this.onTouchEnd = (event: TouchEvent) => {
            event.preventDefault();
            this.update(ActionControllerEventName.buttonUp, TouchActionController.getRaycaster(config, TouchActionController.getClickPosition(<TouchEvent>event), this.camera));
        };

        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart, false);
        this.renderer.domElement.addEventListener('touchmove', this.onTouchMove, false);
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd, false);
    }

    /**
     * Function to get position of the mouse from -1 to 1 in decart coordinates
     * @param {TouchEvent} event touch event
     * @returns {Vector2} coordinates of the mouse
     */
    protected static getClickPosition(event: TouchEvent) {
        let clientX = event.changedTouches[0].clientX,
            clientY = event.changedTouches[0].clientY;

        let mouse = new Vector2();

        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        return mouse;
    }

    protected static getRaycaster(config: ITouchActionControllerConfig, mouse: Vector2, camera: Camera) {
        const raycaster = new Raycaster(new Vector3(), new Vector3(), config.minRaycasterDistance, config.maxRaycasterDistance);

        raycaster.setFromCamera(mouse, camera);
        return raycaster;
    }

    dispose() {
        this.renderer.domElement.removeEventListener('touchstart', this.onTouchStart, false);
        this.renderer.domElement.removeEventListener('touchend', this.onTouchEnd, false);
        this.renderer.domElement.removeEventListener('touchmove', this.onTouchMove, false);
    }
}