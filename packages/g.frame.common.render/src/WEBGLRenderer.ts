import {WebGLRenderer} from 'three';

interface IRendererConfig {
    antialias?: boolean;
    alpha?: boolean;
    preserveDrawingBuffer?: boolean;
    sortObjects?: boolean;
    shadowMapEnabled?: boolean;
    clearColor?: number;
    clearColorAlpha?: number;
    width?: number;
    height?: number;
    autoResize?: boolean;
    containerID?: string;
    onWindowResize?: boolean;
}

const defaultRendererConfig = {
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    // sortObjects: boolean,
    // shadowMapEnabled?: boolean;
    // clearColor?: number;
    // clearColorAlpha?: number;
    // width?: number;
    // height?: number;
    // autoResize?: boolean;
    // containerID?: string;
    // onWindowResize?: boolean;
}

export class WEBGLRenderer {
    private renderer: WebGLRenderer;

    constructor(private config: IRendererConfig) {
        const webglCanvas: any = document.createElement('canvas');


        // const glContext = PPRender.getContext(webglCanvas); // ???

        this.renderer = new WebGLRenderer({
            context: this.getContext(webglCanvas),
            canvas: webglCanvas,
            antialias: this.config.antialias,
            alpha: this.config.alpha,
            preserveDrawingBuffer: this.config.preserveDrawingBuffer,
        });

        this.renderer.sortObjects = this.config.sortObjects == null ? true : this.config.sortObjects;
        this.renderer.xr.enabled = true;
        this.renderer.shadowMap.enabled = this.config.shadowMapEnabled == null ? false : this.config.shadowMapEnabled;

        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(this.config.clearColor, this.config.clearColorAlpha);
        this.renderer.setSize(this.config.width || window.innerWidth, this.config.height || window.innerHeight);
        // this.renderer.setAnimationLoop(this.update);

        // @ts-ignore
        if (this.renderer.getContext().makeXRCompatible instanceof Function)
            // @ts-ignore
            this.renderer.getContext().makeXRCompatible();
    }

    setAnimationLoop(func: any) {
        this.renderer.setAnimationLoop(func);
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
}