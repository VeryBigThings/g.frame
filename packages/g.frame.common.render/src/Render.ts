import {Camera, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';
import {ParentEvent, GframeModule, ViewerAbstract, IViewerConfig} from '@g.frame/core';

export class Renderer extends ViewerAbstract {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: PerspectiveCamera;
    public cameraWrapParent: Object3D;
    public cameraWrap: Object3D;
    public modulesContainer: Object3D;
    protected container: Element;
    protected currentViewer: GframeModule;
    protected _onResizeCallback: () => void;

    protected renderQue: Array<Function>;

    constructor(protected config: IViewerConfig) {
        super();
        const webglCanvas: any = document.createElement('canvas');
        const glContext = Renderer.getContext(webglCanvas);

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
        // this.scene = new Scene();
        this.scene = this.config.scene || new Scene();
        // this.scene.overrideMaterial = this.config.scene.overrideMaterial;

        this.modulesContainer = new Object3D();
        this.scene.add(this.modulesContainer);

        // CAMERA
        this.cameraWrapParent = new Object3D();
        this.scene.add(this.cameraWrapParent);

        this.cameraWrap = new Object3D();
        this.cameraWrapParent.add(this.cameraWrap);

        // this.camera = new PerspectiveCamera(this.config.camera.fov,
        //     (this.config.renderer.width || window.innerWidth) / (this.config.renderer.height || window.innerHeight),
        //     this.config.camera.near,
        //     this.config.camera.far);

        this.camera = config.camera.object;

        this.camera.position.copy(this.config.camera.position);
        this.camera.userData.target = new Vector3().copy(this.config.camera.target);
        this.camera.lookAt(this.camera.userData.target);
        this.cameraWrap.add(this.camera);

        // render que
        this.renderQue = [() => { this.renderer.render(this.scene, this.camera); }];

        if (this.config.renderer.onWindowResize) window.addEventListener('resize', this._onResizeCallback = () => this.updateSize());
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
        const time = performance.now();

        // if (this.controls.enabled) this.controls.update();

        // TWEEN.update(time);

        this.fire('update', new ParentEvent<string>('update', {time: time, frame: frame}));

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);

        // this.renderQue.forEach(func => func());
    }

    setCurrentViewer(newViewer?: GframeModule) {
        if (newViewer === this.currentViewer) return;
        if (this.currentViewer && this.currentViewer.uiObject.parent) {
            this.currentViewer.uiObject.parent.remove(this.currentViewer.uiObject);
            this.currentViewer.dispose();
        }

        if (newViewer) {
            this.currentViewer = newViewer;
            this.scene.add(newViewer.uiObject);
        }
    }

    getDOMContainer(): Element {
        return this.container;
    }

    updateSize(width?: number, height?: number) {
        const newCanvasSize = {
            width: width || this.container.clientWidth,
            height: height || window.innerHeight,
        };

        this.renderer.domElement.style.width = newCanvasSize.width + 'px';
        this.renderer.domElement.style.height = newCanvasSize.height + 'px';

        this.camera.aspect = newCanvasSize.width / newCanvasSize.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(newCanvasSize.width, newCanvasSize.height);
    }

    dispose() {
        this.renderer.dispose();
        document.body.removeChild(this.container);
        window.removeEventListener('resize', this._onResizeCallback);
    }
}