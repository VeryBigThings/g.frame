import {Material, Vector3} from 'three';

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
    };
    scene: {
        overrideMaterial?: Material;
    };
    camera: {
        fov?: number;
        near?: number;
        far?: number;
        position?: Vector3;
        target?: Vector3;
    };
}