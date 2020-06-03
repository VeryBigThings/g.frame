import {Bootstrap, ModulesProcessor} from '@verybigthings/g.frame.core';
import {DesktopModule, OrbitControls} from '@verybigthings/g.frame.desktop';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {TemplateModule} from '../Modules/TemplateModule';
import {OculusQuestModule} from '@verybigthings/g.frame.oculus.quest';
import {Locomotion} from '@verybigthings/g.frame.oculus.quest/build/main/OculusQuestControllers/OculusQuestCameraControls';
import {MovementControlsModule} from '@verybigthings/g.frame.common.movement_controls';
// import {OculusQuestModule} from '@verybigthings/g.frame.oculus.quest';
// import { DrawLevel } from '../Modules/DrawLevel';
// import {Level} from '@verybigthings/g.frame.common.level_manager';

// export default class DrawExample extends Level {
// //     // public app: App;
// //
//     constructor() {
//         super();
//
//         // this.resourcesInUse.push(
//         //     {
//         //         name: 'leaf',
//         //         url: require('../../assets/textures/leaf-1-sheet.png'),
//         //         priority: 0,
//         //         type: ResourceType.TEXTURE
//         //     },
//         //     {
//         //         name: 'FontAwesome&woff2-900-normal',
//         //         url: require('@verybigthings/fontawesome-pro/webfonts/fa-solid-900.woff2'),
//         //         priority: 0,
//         //         type: ResourceType.FONT
//         //     },
//         // );
//         //
//         // this.app = app;
//     }
//
//     // public init(event: ParentEvent) {}
// }

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();

        // const scenarios = [
        //     {
        //         instance: new ParticlesExample(this),
        //         name: 'ParticlesExample',
        //         routerLink: '#ParticlesExample',
        //         showPreloader: false,
        //         events: {},
        //     },
        // ];

        // const levelManagerOptions: LevelManagerOptions = {
        //     name: 'VideoPlayer',
        //     scenarios: scenarios,
        //     preloader: false,
        //     preloaderCamera: false
        // };
        //
        //
        // const levelManager = new LevelManager(levelManagerOptions);
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);
        // const _window = modulesProcessor.agents.get(Factory).getFactory(WindowComponent)({
        //     size: new Vector2(0.3, 0.3),
        //     background: 0xffffff
        // });
        // _window.uiObject.position.set(-1, 1.5, -1.5);
        //
        // this.addObject(_window);
        //
        // let i_window = 0;

        const orbitControls = modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];
        orbitControls.target.set(0, 1.7, 0);
        orbitControls.object.position.set(0, 1.7, 0.01);

        // console.log('Universal agent for template class', modulesProcessor.agents.get(TemplateB));


        modulesProcessor.agents.get(Loader).load().then(() => {
            const hands = modulesProcessor.modules.get(TemplateModule).questHandView;

            // modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0]
            // @ts-ignore
            // console.log('modulesProcessor.modules.get(TemplateModule)', modulesProcessor.modules.get(TemplateModule).drawLevel);
            modulesProcessor.modules.get(TemplateModule).drawLevel.setOrbitControls(orbitControls);
            // modulesProcessor.modules.get(TemplateModule).filter(instance => instance instanceof DrawLevel)[0]
            // this.addObject(hands);
            const movementControlsModule = modulesProcessor.modules.get(MovementControlsModule);
            console.log('movementControlsModule', movementControlsModule);
            //
            modulesProcessor.modules.get(TemplateModule).drawLevel.setLocomotion(movementControlsModule);


            // modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
            //     console.log('Button down event', event);
            //     if (++i_window === 5) {
            //         this.disposeObject(_window);
            //         questModel.setView(hands);
            //     }
            // });
        });
    }
}