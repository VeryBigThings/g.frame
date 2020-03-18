import FrameworkViewer from './rendering/FrameworkViewer';
import { Vector3 } from 'three';

export default class BigG {
    private mainViewer: FrameworkViewer;

    constructor(private mainModule, private modules: Array<any>) {
        const config = {
            renderer: {
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: false,
                sortObjects: false,
                shadowMapEnabled: false,
                clearColor: 0x222222,
                width: window.innerWidth,
                height: window.innerHeight,
                autoResize: true,
                containerID: 'app',
            },
            // scene: {
            //     overrideMaterial: Material;
            // },
            camera: {
                fov: 75,
                near: 0.1,
                far: 10000,
                position: new Vector3(10, 0, 0),
                target: new Vector3(0, 0, 0),
            }
        };

        this.mainViewer = new FrameworkViewer(config);

        this.initMainModule();
    }

    initMainModule() {
        this.mainViewer.scene.add(this.mainModule.uiObject);
    }
}