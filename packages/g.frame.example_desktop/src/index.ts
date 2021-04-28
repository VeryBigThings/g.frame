import ExampleApp from './ExampleApp/ExampleApp';
import {ModulesProcessor} from '@g.frame/core';
import {TemplateModule} from './Modules/TemplateModule';
import {Vector3} from 'three';
import {DesktopModule} from '@g.frame/desktop';

import {InputModule} from '@g.frame/input';

import {LoadersModule} from '@g.frame/common.loaders';


class App {
    private framework: ModulesProcessor;

    constructor() {

        this.framework = new ModulesProcessor({
            modules: [
                new TemplateModule(),
                new DesktopModule(),
                new InputModule(),
                new LoadersModule(),
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
                    onWindowResize: true,
                },
                scene: {
                    overrideMaterial: null,
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
