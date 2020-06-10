import {Object3D} from 'three';
import {IWaypointOptions, Locomotion, MovementControls, Teleport} from './MovementControls';
import {ConstructorInstanceMap, AbstractModule, AbstractModuleStatus} from '@verybigthings/g.frame.core';
import {ActionController, } from '@verybigthings/g.frame.common.action_controller';
import {CameraControls} from '@verybigthings/g.frame.common.camera_controls';

export enum MovementControlsType {
    locomotion = 0,
    teleport = 1,
    // slide = 2,
}

const movementControls = [
    Locomotion, Teleport,
];

export interface IMovementControlsModuleOptions {
    movementType: MovementControlsType;
    maxTeleportDistance?: number;
    waypoint?: IWaypointOptions;
}

export class MovementControlsModule extends AbstractModule {
    public options: IMovementControlsModuleOptions;
    public movementType: MovementControls;
    public scene: Object3D;
    public actionController: ActionController;
    public cameraControls: CameraControls;

    constructor(options: IMovementControlsModuleOptions) {
        super();
        this.options = options;
    }

    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        this.scene = data.viewer.scene;

        return [];
    }

    addNavigationMesh(mesh: Object3D) {
        this.movementType.addNavigationMesh(mesh);
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.actionController = agents.get(ActionController);
        this.cameraControls = agents.get(CameraControls);
        this.movementType = new movementControls[this.options.movementType](this.actionController, this.cameraControls, this.options);
        this.scene.add(this.movementType.waypoint.container);
    }

    getModuleContainer(): Object3D | void {
        return undefined;
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
    }

    onDestroy(): void {
    }

    onResume(): void {
    }

    onPause(): void {
    }
}