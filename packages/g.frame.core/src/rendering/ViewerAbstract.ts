import {Camera, Object3D, Scene, WebGLRenderer} from 'three';
import {IViewerConfig} from './IViewerConfig';
import {EventDispatcher, ParentEvent} from '../core/EventDispatcher';
import {GframeModule} from '../core/GframeModule';


export class ViewerAbstract extends EventDispatcher<string> {
    public renderer: WebGLRenderer;
    public scene: Scene;
    // public camera: PerspectiveCamera;
    public camera: Camera;
    public cameraWrapParent: Object3D;
    public cameraWrap: Object3D;
    public modulesContainer: Object3D;
    protected container: Element;
    protected currentViewer: GframeModule;
    protected _onResizeCallback: () => void;

    protected renderQue: Array<Function>;

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

    }

    render() {

    }

    setCurrentViewer(newViewer?: GframeModule) {
        
    }

    getDOMContainer(): Element {
        return this.container;
    }

    updateSize(width?: number, height?: number) {

    }

    dispose() {

    }
}