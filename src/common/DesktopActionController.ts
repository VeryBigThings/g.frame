import { ActionController, IActionControllerConfig, ActionControllerEventName } from './ActionController';
import { WebGLRenderer, Camera, Vector2 } from 'three';

export class DesktopActionController extends ActionController {
    protected onTouchStart: (event: TouchEvent) => void;
    protected onTouchMove: (event: TouchEvent) => void;
    protected onTouchEnd: (event: TouchEvent) => void;
    protected onMouseDown: (event: MouseEvent) => void;
    protected onMouseUp: (event: MouseEvent) => void;
    protected onMouseMove: (event: MouseEvent) => void;

    constructor(protected config: IActionControllerConfig, protected renderer: WebGLRenderer, protected camera: Camera) {
        super(config);

        this.onTouchStart = (event: TouchEvent) => {
            event.preventDefault();
            this.setFromCamera(DesktopActionController.getClickPosition(<MouseEvent & TouchEvent>event), this.camera);
            this.update(ActionControllerEventName.buttonDown, 0);
        };
        this.onTouchMove = (event: TouchEvent) => {
            event.preventDefault();
            this.setFromCamera(DesktopActionController.getClickPosition(<MouseEvent & TouchEvent>event), this.camera);
            this.update(ActionControllerEventName.move, 0);
        };
        this.onTouchEnd = (event: TouchEvent) => {
            event.preventDefault();
            this.setFromCamera(DesktopActionController.getClickPosition(<MouseEvent & TouchEvent>event), this.camera);
            this.update(ActionControllerEventName.buttonUp, 0);
        };
        this.onMouseDown = (event: MouseEvent) => {
            this.setFromCamera(DesktopActionController.getClickPosition(<MouseEvent & TouchEvent>event), this.camera);
            this.update(ActionControllerEventName.buttonDown, 0);
        };
        this.onMouseUp = (event: MouseEvent) => {
            this.setFromCamera(DesktopActionController.getClickPosition(<MouseEvent & TouchEvent>event), this.camera);
            this.update(ActionControllerEventName.buttonUp, 0);
        };
        this.onMouseMove = (event: MouseEvent) => {
            this.setFromCamera(DesktopActionController.getClickPosition(<MouseEvent & TouchEvent>event), this.camera);
            this.update(ActionControllerEventName.move, 0);
        };

        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart, false);
        this.renderer.domElement.addEventListener('touchmove', this.onTouchMove, false);
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd, false);
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp, false);
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false);
    }

    /**
     * Function to get position of the mouse from -1 to 1 in decart coordinates
     * @param {MouseEvent&TouchEvent} event  touch or mouse event
     * @returns {Vector2} coordinates of the mouse
     */
    private static getClickPosition(event: MouseEvent & TouchEvent) {
        let clientX = event.clientX,
            clientY = event.clientY;
        if (event.changedTouches) {
            clientX = event.changedTouches[0].clientX;
            clientY = event.changedTouches[0].clientY;
        }
        let mouse = new Vector2();

        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        return mouse;
    }

    protected setFromCamera(mouse: Vector2, camera: Camera) {
        this.currentValues.forEach(controller => {
            controller.raycaster.setFromCamera(mouse, camera);
        });
    }

    protected dispose() {
        this.renderer.domElement.removeEventListener('touchstart', this.onTouchStart, false);
        this.renderer.domElement.removeEventListener('touchend', this.onTouchEnd, false);
        this.renderer.domElement.removeEventListener('touchmove', this.onTouchMove, false);
        this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown, false);
        this.renderer.domElement.removeEventListener('mouseup', this.onMouseUp, false);
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove, false);
    }
}