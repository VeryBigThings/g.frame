import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from 'g.frame.core';
import AttachTransformControls from './AttachTransformControls';
import RaycastMesh from './RaycastMesh';
import {DebugGUI} from './DebugGUI';
import {DesktopModule, IDesktopOptions, OrbitControls} from 'g.frame.desktop';
import GlobalNamespace from './GlobalNamespace';
import {ActionController} from 'g.frame.common.action_controller';
import FrameworkViewer from 'g.frame.core/build/main/rendering/Viewer';
import {IDebugOptions} from './interfaces';
import { Object3D } from 'three';

const defaultConfig = {
    enabled: true,
};

export class DebugModule extends AbstractModule {
    public attachTransformControls: AttachTransformControls;
    public globalNamespace: GlobalNamespace;
    public raycastMesh: RaycastMesh;
    public debugGUI: DebugGUI;
    public viewer: FrameworkViewer;
    private config: IDebugOptions;


    constructor(config?: IDebugOptions) {
        super();
        this.config = config || defaultConfig;
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.warn('DebugModule pre-initialization prevented. ' +
            'You need to extend this module, look `g.frame.desktop` module.');
        return {
            enabled: this.config.enabled
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        console.info('Enable debugging features.');
        console.info('The following debugging methods are available:' +
            'attachTransformControls(object) or atc(object): adds TransformControls to the object; \n' +
            'attachClickedMesh or acm: adds TransformControls to the clicked object; \n' +
            'raycastViewerModule or rvm: display information about a clicked ViewerModule; \n' +
            'raycastMesh or rm: display information about a clicked Mesh;'
        );

        this.viewer = data.viewer;
        this.attachTransformControls = new AttachTransformControls();
        this.globalNamespace = new GlobalNamespace();
        this.raycastMesh = new RaycastMesh();
        this.debugGUI = new DebugGUI();
        return [this.attachTransformControls, this.globalNamespace, this.raycastMesh, this.debugGUI];
    }

    afterInit(agents: ConstructorInstanceMap<any>, modules: ConstructorInstanceMap<AbstractModule>): void {
        // @ts-ignore
        this.attachTransformControls.init(this.viewer.renderer.domElement, this.viewer.scene, this.viewer.camera, modules.get(DesktopModule).cameraControls);
        this.raycastMesh.init(agents.get(ActionController), this.viewer.scene);

        // AttachTransformControls
        this.globalNamespace.add('attach', (object?: Object3D) => this.attachTransformControls.attach(object));
        this.globalNamespace.add('attachTransformControls', (object?: Object3D) => this.attachTransformControls.attach(object));
        this.globalNamespace.add('attachClickedMesh', () => {
            this.attachTransformControls.detach();
            this.raycastMesh.raycastMesh((object?: Object3D) => this.attachTransformControls.attach(object));
        });

        // RaycastMesh
        this.globalNamespace.add('raycastViewerModule', () => this.raycastMesh.raycastViewerModule());
        this.globalNamespace.add('raycastMesh', () => this.raycastMesh.raycastMesh());

        // DebugGUI
        this.globalNamespace.add('DebugGUI', this.debugGUI);
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
