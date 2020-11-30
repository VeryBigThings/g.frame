import ExampleApp from './ExampleApp/ExampleApp';
import {ModulesProcessor} from '@verybigthings/g.frame.core';
import {TemplateModule} from './Modules/TemplateModule';
import {Vector3} from 'three';
import {DesktopModule} from '@verybigthings/g.frame.desktop';
import {MobileModule} from '@verybigthings/g.frame.mobile';
import {InputModule} from '@verybigthings/g.frame.input';
import {OculusQuestModule} from '@verybigthings/g.frame.oculus.quest';
import {LoadersModule} from '@verybigthings/g.frame.common.loaders';
import {OimoPhysicsModule} from '@verybigthings/g.frame.physics.oimo';
// import {DropdownComponentModule} from '../../g.frame.components.dropdown/src/DropdownComponentModule';
import {OculusGoModule} from '@verybigthings/g.frame.oculus.go';


class App {
    private framework: ModulesProcessor;

    constructor() {

        const modules = [];


        this.framework = new ModulesProcessor({
            modules: [
                new TemplateModule(),
                new DesktopModule(),
                new MobileModule(),
                new InputModule(),
                new LoadersModule(),
                new OculusQuestModule(),
                new OimoPhysicsModule(),
                new OculusGoModule(),
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