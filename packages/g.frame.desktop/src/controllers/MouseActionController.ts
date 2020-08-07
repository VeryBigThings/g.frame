import {Camera, Raycaster, Vector2, Vector3, WebGLRenderer} from 'three';
import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';

/**
 * A special config for MouseActionController to store the most important options
 * such as near/far parameters of the raycaster
 */
export interface IMouseActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class MouseActionController extends ActionController {
    protected onMouseDown: (event: MouseEvent) => void;
    protected onMouseUp: (event: MouseEvent) => void;
    protected onMouseMove: (event: MouseEvent) => void;

    /**
     * Initialises Mouse events for ActionController
     * @param config config for the class
     * @param renderer your three.js WebGLRenderer
     * @param camera camera you use on the Scene
     */
    constructor(protected config: IMouseActionControllerConfig, protected renderer: WebGLRenderer, protected camera: Camera) {
        super();

        // Check if they were undefined
        this.config.minRaycasterDistance = this.config.minRaycasterDistance || 0;
        this.config.maxRaycasterDistance = this.config.maxRaycasterDistance || Infinity;

        // Define the callbacks
        this.onMouseDown = (event: MouseEvent) => {
            this.update(ActionControllerEventName.buttonDown,
                this.getRaycaster(MouseActionController.getClickPosition(<MouseEvent>event), this.camera)
            );
        };
        this.onMouseUp = (event: MouseEvent) => {
            this.update(ActionControllerEventName.buttonUp,
                this.getRaycaster(MouseActionController.getClickPosition(<MouseEvent>event), this.camera)
            );
        };
        this.onMouseMove = (event: MouseEvent) => {
            this.update(ActionControllerEventName.move,
                this.getRaycaster(MouseActionController.getClickPosition(<MouseEvent>event), this.camera)
            );
        };

        // Subscribe on events
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp, false);
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false);
    }

    /**
     * Function to get position of the mouse from -1 to 1 in decart coordinates
     * @param {MouseEvent} event mouse event
     * @returns {Vector2} coordinates of the mouse
     */
    protected static getClickPosition(event: MouseEvent) {
        let clientX = event.clientX,
            clientY = event.clientY;

        let mouse = new Vector2();

        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        return mouse;
    }

    /**
     * Function to unsubscribe MouseActionController from all of the listened events
     */
    dispose() {
        this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown, false);
        this.renderer.domElement.removeEventListener('mouseup', this.onMouseUp, false);
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove, false);
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
}