import {
    AbstractModule,
    AbstractModuleStatus,
    ConstructorInstanceMap,
    RenderAbstract
} from '@verybigthings/g.frame.core';

import AttachTransformControls from './AttachTransformControls';
import RaycastMesh from './RaycastMesh';
import {DebugGUI} from './DebugGUI';
import {OrbitControls} from '@verybigthings/g.frame.desktop';
import GlobalNamespace from './GlobalNamespace';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';

export class DebugModule extends AbstractModule {
    public attachTransformControls: AttachTransformControls;
    public globalNamespace: GlobalNamespace;
    public raycastMesh: RaycastMesh;
    public debugGUI: DebugGUI;
    public viewer: RenderAbstract;

    constructor() {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.warn('DebugModule pre-initialization prevented. ' +
            'You need to extend this module, look `g.frame.desktop` module.');
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        this.viewer = data.viewer;
        this.globalNamespace = new GlobalNamespace();
        this.attachTransformControls = new AttachTransformControls();
        this.raycastMesh = new RaycastMesh();
        this.debugGUI = new DebugGUI();

        return [this.attachTransformControls, this.globalNamespace, this.raycastMesh, this.debugGUI];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.attachTransformControls.init(this.viewer.renderer.domElement, this.viewer.camera, this.viewer.scene, agents.get(OrbitControls));
        this.raycastMesh.init(agents.get(ActionController), this.viewer.scene);

        this.globalNamespace.add('attachTransformControls', this.attachTransformControls.attach);
        this.globalNamespace.add('raycastMesh', this.raycastMesh.raycastMesh);
        this.globalNamespace.add('raycastViewerModule', this.raycastMesh.raycastViewerModule);
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
    }

    onDestroy(): void {
        this.globalNamespace.dispose();
    }

    onResume(): void {
    }

    onPause(): void {
    }
}