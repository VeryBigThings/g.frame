import ExampleApp from './ExampleApp/ExampleApp';
import {ModulesProcessor} from '@verybigthings/g.frame.core';
import {TemplateModule} from './Modules/TemplateModule';
import {Vector3} from 'three';
import {DesktopModule} from '@verybigthings/g.frame.desktop';
import {MobileModule} from '@verybigthings/g.frame.mobile';
import {WindowComponentModule} from '@verybigthings/g.frame.components.window';
import {ButtonsComponentModule} from '@verybigthings/g.frame.components.buttons';
import {TextComponentModule} from '@verybigthings/g.frame.components.text';
class App {
    private framework: ModulesProcessor;

    constructor() {

        const modules = [];


        this.framework = new ModulesProcessor({
            modules: [
                new TemplateModule(),
                new DesktopModule(),
                new MobileModule(),
                new WindowComponentModule(),
                new ButtonsComponentModule(),
                new TextComponentModule(),
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
                    position: new Vector3(0, 0, 10),
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