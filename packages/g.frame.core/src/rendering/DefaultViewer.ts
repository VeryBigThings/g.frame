import {Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';
import {IViewerConfig} from './IViewerConfig';
import {EventDispatcher, ParentEvent} from '../core/EventDispatcher';
import {ViewerModule} from '../core/ViewerModule';
import FrameworkViewer from './Viewer';


export default class DefaultViewer extends FrameworkViewer {
    public readonly renderer: WebGLRenderer;
    public readonly scene: Scene;
    public readonly camera: PerspectiveCamera;
    public readonly cameraWrapParent: Object3D;
    public readonly cameraWrap: Object3D;
    public readonly modulesContainer: Object3D;
    private currentViewer: ViewerModule;
    private _onResizeCallback: () => void;

    constructor(private config: IViewerConfig) {
        super();
        const webglCanvas: any = document.createElement('canvas');
        const glContext = FrameworkViewer.getContext(webglCanvas);

        this.renderer = new WebGLRenderer({
            context: glContext,
            canvas: webglCanvas,
            antialias: this.config.renderer.antialias,
            alpha: this.config.renderer.alpha,
            preserveDrawingBuffer: this.config.renderer.preserveDrawingBuffer,
        });

        this.renderer.sortObjects = this.config.renderer.sortObjects == null ? true : this.config.renderer.sortObjects;
        this.renderer.xr.enabled = true;
        this.renderer.shadowMap.enabled = this.config.renderer.shadowMapEnabled == null ? false : this.config.renderer.shadowMapEnabled;

        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(this.config.renderer.clearColor, this.config.renderer.clearColorAlpha);
        this.renderer.setSize(this.config.renderer.width || window.innerWidth, this.config.renderer.height || window.innerHeight);
        this.renderer.setAnimationLoop(this.update);

        // @ts-ignore
        if (this.renderer.getContext().makeXRCompatible instanceof Function)
            // @ts-ignore
            this.renderer.getContext().makeXRCompatible();

        // CONTAINER
        this.container = document.createElement('div');

        this.container.id = this.config.renderer.containerID;

        this.container.appendChild(webglCanvas);
        document.body.appendChild(this.container);

        // SCENE
        this.scene = new Scene();
        this.scene.overrideMaterial = this.config.scene.overrideMaterial;

        this.modulesContainer = new Object3D();
        this.scene.add(this.modulesContainer);

        // CAMERA
        this.cameraWrapParent = new Object3D();
        this.scene.add(this.cameraWrapParent);

        this.cameraWrap = new Object3D();
        this.cameraWrapParent.add(this.cameraWrap);

        this.camera = new PerspectiveCamera(this.config.camera.fov,
            (this.config.renderer.width || window.innerWidth) / (this.config.renderer.height || window.innerHeight),
            this.config.camera.near,
            this.config.camera.far);
        this.camera.position.copy(this.config.camera.position);
        this.camera.userData.target = new Vector3().copy(this.config.camera.target);
        this.camera.lookAt(this.camera.userData.target);
        this.cameraWrap.add(this.camera);

        if (this.config.renderer.onWindowResize) window.addEventListener('resize', this._onResizeCallback = () => this.updateSize());
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}