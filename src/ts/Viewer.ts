import {Fog, Mesh, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';


export default class FrameworkViewer {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: PerspectiveCamera;
    public container: Node;

    private cameraWrapParent: Object3D;

    constructor(private config: any) {
        const webglCanvas: any = document.createElement('canvas');
        const glContext = this.getContext(webglCanvas);

        this.renderer = new WebGLRenderer({
            context: glContext,
            canvas: webglCanvas,
            antialias: true,
            alpha: this.config.rendererAlpha,
            preserveDrawingBuffer: true,
        });

        this.renderer.sortObjects = true;
        this.renderer.xr.enabled = true;
        this.renderer.shadowMap.enabled = true;

        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(this.config.rendererClearColor, this.config.rendererClearColorAlpha);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        let scope = this;
        this.renderer.setAnimationLoop(this.update);

        // @ts-ignore
        this.renderer.getContext().makeXRCompatible(); // ???

        // CONTAINER
        this.container = document.createElement('div');

        (<Element>this.container).id = 'threeJS';

        this.container.appendChild(webglCanvas);
        document.body.appendChild(this.container);

        // SCENE
        this.scene = new Scene();
        // this.scene.fog = new Fog(this.config.fogHex, this.config.fogNear, this.config.fogFar);

        // CAMERA
        this.cameraWrapParent = new Object3D();
        this.scene.add(this.cameraWrapParent);

        const cameraWrap = new Object3D();
        this.cameraWrapParent.add(cameraWrap);

        this.camera = new PerspectiveCamera(this.config.cameraFov, window.innerWidth / window.innerHeight, this.config.cameraNear, this.config.cameraFar);
        this.camera.position.copy(this.config.cameraPosition);
        this.camera.userData.target = new Vector3().copy(this.config.isDebug ? this.config.cameraTargetDebug : this.config.cameraTargetNormal);
        this.camera.lookAt(this.camera.userData.target);
        cameraWrap.add(this.camera);
    }

    getContext(webglCanvas) {
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

        // if (this.controls.enabled) this.controls.update();

        // TWEEN.update(time);

        // this.fire('update', new ParentEvent('update', {time: time, frame: frame}));

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}