import ExampleApp from './ExampleApp/ExampleApp';
import {ModulesProcessor} from '@verybigthings/g.frame.core';
import {TemplateModule} from './Modules/TemplateModule';
import {Vector3, ShaderMaterial, Vector2, PerspectiveCamera, Scene} from 'three';
import {DesktopModule} from '@verybigthings/g.frame.desktop';
import {MobileModule} from '@verybigthings/g.frame.mobile';
import {WindowComponentModule} from '@verybigthings/g.frame.components.window';
import {ButtonsComponentModule} from '@verybigthings/g.frame.components.buttons';
import {TextComponentModule} from '@verybigthings/g.frame.components.text';
import {SlidersComponentModule} from '@verybigthings/g.frame.components.sliders';
import {InputModule} from '@verybigthings/g.frame.input';
import {InputComponentModule} from '@verybigthings/g.frame.components.input';
import {VirtualKeyboardModule} from '@verybigthings/g.frame.components.keyboard';
import {OculusQuestModule} from '@verybigthings/g.frame.oculus.quest';
import {LoadersModule} from '@verybigthings/g.frame.common.loaders';
import {OimoPhysicsModule} from '@verybigthings/g.frame.physics.oimo';
import {DropdownComponentModule} from '../../g.frame.components.dropdown/src/DropdownComponentModule';
import {OculusGoModule} from '@verybigthings/g.frame.oculus.go';

// ????
// import {ModulesProcessor} from '../../g.frame.core/src/core/ModulesProcessor';
import {RenderModule} from '../../g.frame.common.render/src/RenderModule';
import {Renderer, PPRender} from '../../g.frame.common.render/build/main/index';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

class App {
    private framework: ModulesProcessor;

    constructor() {

        const modules = [];

        const renderer = new PPRender({
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
            scene: new Scene,
            camera: new PerspectiveCamera(75, (window.innerWidth) / (window.innerHeight), 0.1, 10000)
            // camera: {
            //     fov: 75,
            //     near: 0.1,
            //     far: 10000,
            //     position: new Vector3(0, 0, 10),
            //     target: new Vector3(0, 0, 0),
            // }
        })

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
                new DropdownComponentModule(),
                new OimoPhysicsModule(),
                new OculusGoModule(),
            ],
            viewer: renderer,
            bootstrap: new ExampleApp()
        });
        this.setComposer(renderer);

        this.init();
    }

    init() {


    }

    setComposer(renderer) {
        const composer = renderer.composer;
        console.log(renderer);
        const pixelRatio = renderer.renderer.getPixelRatio();

        const fxaaPass = new ShaderPass( FXAAShader );
        // @ts-ignore
        (<ShaderMaterial>fxaaPass.material).uniforms[ 'resolution' ].value.x = 1 / ( renderer.container.clientWidth * pixelRatio );
        // (<ShaderMaterial>fxaaPass.material).uniforms[ 'resolution' ].value.x = 1 / ( this.containerWidth * pixelRatio );
        // @ts-ignore
        (<ShaderMaterial>fxaaPass.material).uniforms[ 'resolution' ].value.y = 1 / ( renderer.container.clientHeight * pixelRatio );


        // blur shader
        const blurPass = new ShaderPass( VerticalBlurShader );
        // (<ShaderMaterial>blurPass.material).uniforms[ 'v' ].value = 0.3 / this.containerWidth;
        (<ShaderMaterial>blurPass.material).uniforms[ 'v' ].value = 0.8 / 1300;


        // bloom 
        const bloomPass = new UnrealBloomPass( new Vector2( renderer.container.clientWidth, renderer.container.clientHeight ), 0.3, 0.05, 0 );

        // vignete shader
        const VignettePass = new ShaderPass( VignetteShader );
        (<ShaderMaterial>VignettePass.material).uniforms[ 'darkness' ].value = 1.0;
        (<ShaderMaterial>VignettePass.material).uniforms[ 'offset' ].value = 0.6;

        const renderPass = new RenderPass(renderer.scene, renderer.camera);

        composer.renderToScreen = true;

        composer.addPass(renderPass);

        // composer.addPass(VignettePass);
        composer.addPass(bloomPass);
        // composer.addPass(blurPass);
        composer.addPass(fxaaPass);
    }
}

new App();