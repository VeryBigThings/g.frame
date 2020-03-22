import { WebGLRenderer, Camera, Raycaster, Vector3, Vector2 } from 'three';
import {ActionController, ActionControllerEventName} from '../../../src/common';

/**
 * A special config for TouchActionController class to store the most important options
 * Such as near/far parameters of the raycaster
 */
interface ITouchActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class TouchActionController extends ActionController {
    protected onTouchStart: (event: TouchEvent) => void;
    protected onTouchMove: (event: TouchEvent) => void;
    protected onTouchEnd: (event: TouchEvent) => void;

    /**
     * Initialises Touch events for ActionController
     * @param config Config for the class
     * @param renderer Your three.js WebGLRenderer
     * @param camera Camera you use on the Scene
     */
    constructor(protected config: ITouchActionControllerConfig, protected renderer: WebGLRenderer, protected camera: Camera) {
        super();

        // Check if they were undefined
        this.config.minRaycasterDistance = this.config.minRaycasterDistance || 0;
        this.config.maxRaycasterDistance = this.config.maxRaycasterDistance || Infinity;

        // Define the callbacks
        this.onTouchStart = (event: TouchEvent) => {
            event.preventDefault();
            this.update(ActionControllerEventName.buttonDown,
                this.getRaycaster(TouchActionController.getClickPosition(<TouchEvent>event), this.camera)
            );
        };
        this.onTouchMove = (event: TouchEvent) => {
            event.preventDefault();
            this.update(ActionControllerEventName.move,
                this.getRaycaster(TouchActionController.getClickPosition(<TouchEvent>event), this.camera)
            );
        };
        this.onTouchEnd = (event: TouchEvent) => {
            event.preventDefault();
            this.update(ActionControllerEventName.buttonUp,
                this.getRaycaster(TouchActionController.getClickPosition(<TouchEvent>event), this.camera)
            );
        };

        // Subscribe on events
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

    /**
     * Function to create a raycaster
     * @returns raycaster with a done ray
     */
    protected getRaycaster(mouse: Vector2, camera: Camera) {
        const raycaster = new Raycaster(new Vector3(), new Vector3(), this.config.minRaycasterDistance, this.config.maxRaycasterDistance);

        raycaster.setFromCamera(mouse, camera);
        return raycaster;
    }

    /**
     * Function to unsubscribe TouchActionController from all of the listened events
     */
    dispose() {
        this.renderer.domElement.removeEventListener('touchstart', this.onTouchStart, false);
        this.renderer.domElement.removeEventListener('touchend', this.onTouchEnd, false);
        this.renderer.domElement.removeEventListener('touchmove', this.onTouchMove, false);
    }
}