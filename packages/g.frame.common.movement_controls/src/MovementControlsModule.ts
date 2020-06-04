import {Object3D} from 'three';
import {IWaypointOptions, Locomotion, MovementControls, Teleport} from './MovementControls';
import {ConstructorInstanceMap, AbstractModule, AbstractModuleStatus} from '@verybigthings/g.frame.core';
import {ActionController, } from '@verybigthings/g.frame.common.action_controller';

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
    public camera: Object3D;
    public cameraWrap: Object3D;
    public actionController: ActionController;

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
        this.camera = data.viewer.camera;
        this.cameraWrap = data.viewer.cameraWrap;

        return [];
    }

    addNavigationMesh(mesh: Object3D) {
        this.movementType.addNavigationMesh(mesh);
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.actionController = agents.get(ActionController);
        this.movementType = new movementControls[this.options.movementType](this.actionController, this.cameraWrap, this.camera, this.options);
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