import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import AttachTransformControls from './AttachTransformControls';
import WindowAdd from './WindowAdd';
import RaycastMesh from './RaycastMesh';
import {DebugGUI} from './DebugGUI';

export class DebugModule extends AbstractModule {
    public attachTransformControls: AttachTransformControls;
    public windowAdd: WindowAdd;
    public raycastMesh: RaycastMesh;
    public debugGUI: DebugGUI;

    constructor() {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.warn('DebugModule pre-initialization prevented. ' +
            'You need to extend this module, look `g.frame.desktop` module.');
        return {
            enabled: false
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        this.attachTransformControls = new AttachTransformControls();
        this.windowAdd = new WindowAdd();
        this.raycastMesh = new RaycastMesh();
        this.debugGUI = new DebugGUI();
        return [this.attachTransformControls, this.windowAdd, this.raycastMesh, this.debugGUI];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
    }

    onDestroy(): void {
        this.windowAdd.dispose();
    }

    onResume(): void {
    }

    onPause(): void {
    }
}