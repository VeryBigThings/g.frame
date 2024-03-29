import {ActionController, ActionControllerEventName} from '@g.frame/common.action_controller';
import {Raycaster, Vector3} from 'three';
import {IOculusQuestActionControllerConfig} from '../interfaces';

export class OculusQuestActionController extends ActionController {
    protected onButtonDown: (event: any) => void;
    protected onButtonUp: (event: any) => void;
    protected onClick: (event: any) => void;
    protected onMove: (event: any) => void;

    /**
     * Initialises Oculus Quest events for ActionController
     * @param config Config for the class
     * @param oculusQuestController Oculus Quest controller which fires the events
     */
    constructor(protected data: any, protected config: IOculusQuestActionControllerConfig, protected oculusQuestModel: any) {
        super();

        // Check if they were undefined
        this.config.minRaycasterDistance = this.config.minRaycasterDistance || 0;
        this.config.maxRaycasterDistance = this.config.maxRaycasterDistance || Infinity;

        // Define the callbacks
        this.onButtonDown = (event: any) => {
            this.update(ActionControllerEventName.buttonDown, this.getRaycaster(event.data.position, event.data.direction), event.data.controllerNumber);
        };
        this.onButtonUp = (event: any) => {
            this.update(ActionControllerEventName.buttonUp, this.getRaycaster(event.data.position, event.data.direction), event.data.controllerNumber);
        };
        this.onClick = (event: any) => {
            this.update(ActionControllerEventName.click, this.getRaycaster(event.data.position, event.data.direction), event.data.controllerNumber);
        };
        this.onMove = (event: any) => {
            this.update(ActionControllerEventName.move, this.getRaycaster(event.data.position, event.data.direction), event.data.controllerNumber);
        };

        // Subscribe on events
        this.oculusQuestModel.on('buttonDown', this.onButtonDown);
        this.oculusQuestModel.on('buttonUp', this.onButtonUp);
        // this.oculusQuestModel.on('click', this.onClick);
        this.oculusQuestModel.on('move', this.onMove);
    }

    /**
     * Function to unsubscribe OculusQuestActionController from all of the listened events
     */
    dispose() {
        this.oculusQuestModel.off('buttonDown', this.onButtonDown);
        this.oculusQuestModel.off('buttonUp', this.onButtonUp);
        this.oculusQuestModel.off('click', this.onClick);
        this.oculusQuestModel.off('move', this.onMove);
    }

    /**
     * Function to create a raycaster
     * @returns raycaster with a done ray
     */
    protected getRaycaster(position: Vector3, direction: Vector3) {
        return new Raycaster(position, direction, this.config.minRaycasterDistance, this.config.maxRaycasterDistance);
    }
}
