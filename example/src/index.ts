import ExampleApp from './ExampleApp/ExampleApp';
import {ModulesProcessor} from '../../src';
import {TemplateModule} from './Modules/TemplateModule';
import {Vector3} from 'three';
class App {
    private framework: ModulesProcessor;

    constructor() {

        const modules = [];


        this.framework = new ModulesProcessor({
            modules: [
                new TemplateModule()
            ],
            viewerConfig: {
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
                scene: {
                    // overrideMaterial: Material;
                },
                camera: {
                    fov: 75,
                    near: 0.1,
                    far: 10000,
                    position: new Vector3(10, 0, 0),
                    target: new Vector3(0, 0, 0),
                }
            },
            bootstrap: new ExampleApp()
        });
        this.init();
    }

    init() {



    }
}

new App();