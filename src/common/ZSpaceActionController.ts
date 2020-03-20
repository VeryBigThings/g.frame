import { ActionController, ActionControllerEventName } from './ActionController';
import { VRControlsEvent } from './VRControlsEvent';
import { Vector3, Raycaster } from 'three';

export interface IZSpaceActionControllerConfig {
    minRaycasterDistance: number;
    maxRaycasterDistance: number;
}

export class ZSpaceActionController extends ActionController {
    protected onButtonDown: (event: VRControlsEvent) => void;
    protected onButtonUp: (event: VRControlsEvent) => void;
    protected onMove: (event: VRControlsEvent) => void;

    constructor(protected config: IZSpaceActionControllerConfig, protected zSpaceControls: any) {
        super();

        this.onButtonDown = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonDown, ZSpaceActionController.getRaycaster(config, event.position, event.direction));
        };
        this.onButtonUp = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.buttonUp, ZSpaceActionController.getRaycaster(config, event.position, event.direction));
        };
        this.onMove = (event: VRControlsEvent) => {
            this.update(ActionControllerEventName.move, ZSpaceActionController.getRaycaster(config, event.position, event.direction));
        };

        this.zSpaceControls.on('buttonDown', this.onButtonDown);
        this.zSpaceControls.on('buttonUp', this.onButtonUp);
        this.zSpaceControls.on('move', this.onMove);
    }

    protected static getRaycaster(config: IZSpaceActionControllerConfig, position: Vector3, direction: Vector3) {
        return new Raycaster(position, direction, config.minRaycasterDistance, config.maxRaycasterDistance);
    }

    dispose() {
        this.zSpaceControls.off('buttonDown', this.onButtonDown);
        this.zSpaceControls.off('buttonUp', this.onButtonUp);
        this.zSpaceControls.off('move', this.onMove);
    }
}