import {BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector2} from 'three';
import {Bootstrap, Factory, ModulesProcessor, Tween} from '@g.frame/core';
import {TemplateA} from '../Modules/TemplateA';
import {WindowComponent} from '@g.frame/components.window';
import {IconButtonComponent} from '@g.frame/components.buttons';
import {CircleSliderComponent, CircleSliderComponentSlidingMode} from '@g.frame/components.sliders';
import {DesktopModule, OrbitControls} from '@g.frame/desktop';
import {InputModule, InputType} from '@g.frame/input';
import {IInputComponentOptions, InputComponent} from '@g.frame/components.input';
import {ActionController, ActionControllerEventName} from '@g.frame/common.action_controller';
import {Loader} from '@g.frame/common.loaders';
import {TemplateModule} from '../Modules/TemplateModule';
import {OculusQuestModule} from '@g.frame/oculus.quest';
import {oimo} from 'oimophysics';
// import {DropdownComponent} from '../../../g.frame.components.dropdown/src/DropdownComponent';
import {OculusGoModule} from '@g.frame/oculus.go';
import World = oimo.dynamics.World;
// import {GamepadEvents, GamepadModule, GamepadKeyNames} from '@g.frame/common.gamepad';
// import {GamepadKeyNames} from '@g.frame/common.gamepad/build/main/GamepadModel';

export default class ExampleApp extends Bootstrap {
    // private gamepadModule: GamepadModule;
    // private circleSlider: CircleSliderComponent;
    // private oculusQuestModule: OculusQuestModule;
    // private actionController: ActionController;

    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);

        // this.gamepadModule = modulesProcessor.modules.get(GamepadModule);
        // console.log('gamepadModule', this.gamepadModule);


        // const _world = modulesProcessor.agents.get(Factory).getFactory(World)(null);
        // console.log('_world', _world);

        // const _window = modulesProcessor.agents.get(Factory).getFactory(WindowComponent)({
        //     size: new Vector2(0.3, 0.3),
        //     background: 0xffffff
        // });


        // const w = modulesProcessor.agents.get(Factory).getFactory(WindowComponent);

        // _window.uiObject.position.set(-1, 1.5, -1.5);

        // this.addObject(_window);



        const box = new Mesh(new BoxGeometry(0.01, 1, 1), new MeshBasicMaterial({color: '#ff3333'}));

        box.position.set(-1.5, 1.5, -1.5);

        this.addObject(box);

        this.actionController = modulesProcessor.agents.get(ActionController);

        // this.actionController.on(ActionControllerEventName.buttonDown, box, (event) => {
        //     console.log('Button down event', event);

        // });


        // const orbitControls = modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];

        modulesProcessor.agents.get(Loader).load().then(() => {
            const hands = modulesProcessor.modules.get(TemplateModule).questHandView;

            // this.actionController.on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
            //     console.log('Button down event', event);
            //     if (++i_window === 5) {
            //         this.disposeObject(_window);
            //         oculusQuestManager?.setXRControllerView(hands);
            //     }
            // });
        });

        this.initGamepadEvents();
    }

    initGamepadEvents() {

    }
}
