import {Material, Scene, Vector3, PerspectiveCamera} from 'three';

export interface IViewerConfig {
    renderer: {
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
    };
    scene: Scene;
    camera: {
        object: PerspectiveCamera;
        position?: Vector3;
        target?: Vector3;
    };
}