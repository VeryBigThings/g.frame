import {Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';
import {IViewerConfig} from './interfaces';
import {ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import RenderAbstract from './RenderAbstract';


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';


export default class FrameworkViewer extends RenderAbstract {
    public composer: EffectComposer;

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

        // render que
        this.renderQue = [() => { this.renderer.render(this.scene, this.camera); }];

        if (this.config.renderer.onWindowResize) window.addEventListener('resize', this._onResizeCallback = () => this.updateSize());

        this.setComposer();
    }

    setComposer() {
        this.composer = new EffectComposer(this.renderer);
    }


    render() {
        // this.renderer.render(this.scene, this.camera);

        this.renderQue.forEach(func => func());
        //
        // this.composer.render();
    }

    setRenderQue(newQue: Array<Function>) {
        this.renderQue = [...newQue];
    }

    setComposer_() {
        const pixelRatio = this.renderer.getPixelRatio();

        const fxaaPass = new ShaderPass( FXAAShader );
        (<ShaderMaterial>fxaaPass.material).uniforms[ 'resolution' ].value.x = 1 / ( this.containerWidth * pixelRatio );
        (<ShaderMaterial>fxaaPass.material).uniforms[ 'resolution' ].value.y = 1 / ( this.containerHeight * pixelRatio );

        // film shader
        const filmPass = new ShaderPass( FilmShader );
        (<ShaderMaterial>filmPass.material).uniforms['grayscale'].value = 0;
        (<ShaderMaterial>filmPass.material).uniforms['nIntensity'].value = 0.3;
        (<ShaderMaterial>filmPass.material).uniforms['sIntensity'].value = 0;

        // blur shader
        const blurPass = new ShaderPass( VerticalBlurShader );
        (<ShaderMaterial>blurPass.material).uniforms[ 'v' ].value = 0.3 / this.containerWidth;


        // vignete shader
        const VignettePass = new ShaderPass( VignetteShader );
        (<ShaderMaterial>VignettePass.material).uniforms[ 'darkness' ].value = 1.0;
        (<ShaderMaterial>VignettePass.material).uniforms[ 'offset' ].value = 0.6;

        this.scenePasses();


        // screenPass
        this.screenPass = new ShaderPass( ScreenShader );
        const screenMat = (<ShaderMaterial>this.screenPass.material);

        screenMat.uniforms[ 'resolution' ].value.x = 1 / ( this.containerWidth * pixelRatio );
        screenMat.uniforms[ 'resolution' ].value.y = 1 / ( this.containerHeight * pixelRatio );
 
        screenMat.uniforms[ 'tEffectsScene1' ].value = this.effectsComposer1.renderTarget2.texture;
        screenMat.uniforms[ 'tBloomScene1' ].value = this.effectsComposer1_bloom.renderTarget2.texture;
        screenMat.uniforms[ 'tEffectsScene2' ].value = this.effectsComposer2.renderTarget2.texture;
        screenMat.uniforms[ 'tBloomScene2' ].value = this.effectsComposer2_bloom.renderTarget2.texture;

        this.composer = new EffectComposer( this.renderer );
        this.composer.renderToScreen = true;

        this.composer.addPass(this.screenPass);

        this.composer.addPass(filmPass);
        this.composer.addPass(VignettePass);
        // this.composer.addPass(blurPass);
        this.composer.addPass(fxaaPass);
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