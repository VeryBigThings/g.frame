import {Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';
import {IViewerConfig} from './interfaces';
import {EventDispatcher, ParentEvent} from '@verybigthings/g.frame.core';
import {ViewerModule} from '@verybigthings/g.frame.core';


export default abstract class RenderAbstract extends EventDispatcher<string> {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: PerspectiveCamera;
    public cameraWrapParent: Object3D;
    public cameraWrap: Object3D;
    public modulesContainer: Object3D;
    protected container: Element;
    protected currentViewer: ViewerModule;
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

    setCurrentViewer(newViewer?: ViewerModule) {

    }

    getDOMContainer(): Element {
        return this.container;
    }

    updateSize(width?: number, height?: number) {

    }

    dispose() {

    }
}