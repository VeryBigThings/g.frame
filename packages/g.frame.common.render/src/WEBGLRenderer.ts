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
            context: glContext,
            canvas: webglCanvas,
            antialias: this.config.antialias,
            alpha: this.config.alpha,
            preserveDrawingBuffer: this.config.preserveDrawingBuffer,
        });

        this.renderer.sortObjects = this.config.sortObjects == null ? true : this.config.sortObjects;
        this.renderer.xr.enabled = true;
        this.renderer.shadowMap.enabled = this.config.shadowMapEnabled == null ? false : this.config.shadowMapEnabled;

        this.renderer.setPixelRatio(1);
        // this.renderer.setClearColor(this.config.renderer.clearColor, this.config.renderer.clearColorAlpha);
        this.renderer.setClearColor('#333355', this.config.clearColorAlpha);
        this.renderer.setSize(this.config.width || window.innerWidth, this.config.height || window.innerHeight);
        // this.renderer.setAnimationLoop(this.update);

        // @ts-ignore
        if (this.renderer.getContext().makeXRCompatible instanceof Function)
            // @ts-ignore
            this.renderer.getContext().makeXRCompatible();
    }
}