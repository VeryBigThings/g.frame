import {Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';
import {IViewerConfig} from './IViewerConfig';
import { OrbitControls } from '../controls/OrbitControls';


export default class FrameworkViewer {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: PerspectiveCamera;
    public container: HTMLDivElement;

    public cameraWrapParent: Object3D;
    public cameraWrap: Object3D;

    public controls: OrbitControls;

    // constructor(private config: IViewerConfig) {
    constructor(private config: any) {
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
        this.renderer.getContext().makeXRCompatible(); // ???

        // CONTAINER
        this.container = document.createElement('div');

        this.container.id = this.config.renderer.containerID;

        this.container.appendChild(webglCanvas);
        document.body.appendChild(this.container);

        // SCENE
        this.scene = new Scene();
        // this.scene.overrideMaterial = this.config.scene.overrideMaterial;

        // CAMERA
        this.initCamera();

        // CONTROLS
        this.initControls();
    }

    initCamera() {
        this.cameraWrapParent = new Object3D();
        this.scene.add(this.cameraWrapParent);

        this.cameraWrap = new Object3D();
        this.cameraWrapParent.add(this.cameraWrap);

        this.camera = new PerspectiveCamera(this.config.camera.fov,
            (this.config.renderer.width || window.innerWidth) / (this.config.renderer.height || window.innerHeight),
            this.config.camera.near,
            this.config.camera.far);

        this.camera.position.copy(this.config.camera.position);
        // this.camera.userData.target = new Vector3().copy(this.config.camera.target);
        this.camera.lookAt(new Vector3());
        this.cameraWrap.add(this.camera);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.container);

        this.controls.enabled = true;
        this.controls.enableRotate = true;
        this.controls.rotateSpeed = 1;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;

        // this.actionController = new ActionController(this.camera, this.vrControls, this.zSpaceControls || null, this.renderer);
    }

    static getContext(webglCanvas) {
        const contextTypes = ['webgl2', 'experimental-webgl', 'webgl'];
        let glContext;

        for (const contextType of contextTypes) {
            glContext = webglCanvas.getContext(contextType, {});

            if (glContext) break;
        }

        return glContext;
    }

    update = (_time, frame) => {
        // const time = performance.now();

        this.controls && this.controls.update();

        // TWEEN.update(time);

        // this.fire('update', new ParentEvent('update', {time: time, frame: frame}));

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}