import { ActionController, ActionControllerEventName } from './ActionController';
import { WebGLRenderer, Camera, Vector2, Raycaster, Vector3 } from 'three';

interface IMoveActionControllerConfig {
    controllersQuantity: number;
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class MoveActionController extends ActionController {
    protected onMouseDown: (event: MouseEvent) => void;
    protected onMouseUp: (event: MouseEvent) => void;
    protected onMouseMove: (event: MouseEvent) => void;

    constructor(protected config: IMoveActionControllerConfig, protected renderer: WebGLRenderer, protected camera: Camera) {
        super();

        this.onMouseDown = (event: MouseEvent) => {
            this.update(ActionControllerEventName.buttonDown, MoveActionController.getRaycaster(config, MoveActionController.getClickPosition(<MouseEvent>event), this.camera));
        };
        this.onMouseUp = (event: MouseEvent) => {
            this.update(ActionControllerEventName.buttonUp, MoveActionController.getRaycaster(config, MoveActionController.getClickPosition(<MouseEvent>event), this.camera));
        };
        this.onMouseMove = (event: MouseEvent) => {
            this.update(ActionControllerEventName.move, MoveActionController.getRaycaster(config, MoveActionController.getClickPosition(<MouseEvent>event), this.camera));
        };

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

    protected static getRaycaster(config: IMoveActionControllerConfig, mouse: Vector2, camera: Camera) {
        const raycaster = new Raycaster(new Vector3(), new Vector3(), config.minRaycasterDistance, config.maxRaycasterDistance);

        raycaster.setFromCamera(mouse, camera);
        return raycaster;
    }

    dispose() {
        this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown, false);
        this.renderer.domElement.removeEventListener('mouseup', this.onMouseUp, false);
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove, false);
    }
}