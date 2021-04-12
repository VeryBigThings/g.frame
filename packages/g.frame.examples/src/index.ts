import ExampleApp from './ExampleApp/ExampleApp';
import {ModulesProcessor} from 'g.frame.core';
import {TemplateModule} from './Modules/TemplateModule';
import {Vector3} from 'three';
import {DesktopModule} from 'g.frame.desktop';
import {MobileModule} from 'g.frame.mobile';
import {WindowComponentModule} from 'g.frame.components.window';
import {ButtonsComponentModule} from 'g.frame.components.buttons';
import {TextComponentModule} from 'g.frame.components.text';
import {SlidersComponentModule} from 'g.frame.components.sliders';
import {InputModule} from 'g.frame.input';
import {InputComponentModule} from 'g.frame.components.input';
import {VirtualKeyboardModule} from 'g.frame.components.keyboard';
import {OculusQuestModule} from 'g.frame.oculus.quest';
import {LoadersModule} from 'g.frame.common.loaders';
import {OimoPhysicsModule} from 'g.frame.physics.oimo';
// import {DropdownComponentModule} from '../../g.frame.components.dropdown/src/DropdownComponentModule';
import {OculusGoModule} from 'g.frame.oculus.go';


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
                new InputComponentModule(),
                new ButtonsComponentModule(),
                new TextComponentModule(),
                new SlidersComponentModule(),
                new InputModule(),
                new LoadersModule(),
                new VirtualKeyboardModule(),
                new OculusQuestModule(),
                // new DropdownComponentModule(),
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
