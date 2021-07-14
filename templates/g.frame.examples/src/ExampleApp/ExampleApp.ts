import {BoxBufferGeometry, BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector2} from 'three';
import {Bootstrap, Factory, ModulesProcessor, Tween} from '@g.frame/core';
import {TemplateA} from '../Modules/TemplateA';
import {DesktopModule, OrbitControls} from '@g.frame/desktop';
import {InputModule, InputType} from '@g.frame/input';
import {ActionController, ActionControllerEventName} from '@g.frame/common.action_controller';
import {Loader} from '@g.frame/common.loaders';
import {TemplateModule} from '../Modules/TemplateModule';
// import {OculusQuestModule} from '@g.frame/oculus.quest';
import {oimo} from 'oimophysics';
import World = oimo.dynamics.World;
// import {GamepadEvents, GamepadModule, GamepadKeyNames} from '@g.frame/common.gamepad';
// import {GamepadKeyNames} from 'g.frame.common.gamepad/build/main/GamepadModel';
// import {GamepadEvents, GamepadModule, GamepadKeyNames} from '@verybigthings/g.frame.common.gamepad';
// import {GamepadKeyNames} from '@verybigthings/g.frame.common.gamepad/build/main/GamepadModel';

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

        // const _world = modulesProcessor.agents.get(Factory).getFactory(World)(null);
        // console.log('_world', _world);

        // const _window = modulesProcessor.agents.get(Factory).getFactory(WindowComponent)({
        //     size: new Vector2(0.3, 0.3),
        //     background: 0xffffff
        // });

        // const _world = modulesProcessor.agents.get(Factory).getFactory(World)(null);
        // console.log('_world', _world);

        // const w = modulesProcessor.agents.get(Factory).getFactory(WindowComponent);

        // _window.uiObject.position.set(-1, 1.5, -1.5);

        // this.addObject(_window);

        // let i_window = 0;

        // this.addObject(_window);


        const box = new Mesh(new BoxBufferGeometry(1, 1, 1), new MeshBasicMaterial({color: '#ee4444'}));
        this.addObject(box);

        // const oculusGoManager = modulesProcessor.modules.get(OculusGoModule).oculusGoManager;
        // const oculusQuestManager = modulesProcessor.modules.get(OculusQuestModule).oculusQuestManager;

        // this.addObject(box);

        // let i_box = 0;

        // modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, box, (event) => {
        //     console.log('Button down event', event);
        //     if (++i_box === 5) {
        //         this.disposeObject(box);
        //         oculusGoManager?.setXRControllerView(null);
        //         oculusQuestManager?.setXRControllerView(null);
        //     }
        // });

        // const iconButton = modulesProcessor.agents.get(Factory).getFactory(IconButtonComponent)({
        //     text: '+',
        //     background: new Color(0xeeaa88).getStyle(),
        //     iconSize: 0.6,
        //     diameter: 0.1
        // });

        // iconButton.uiObject.position.set(-0.7, 1.5, -1.5);

        // this.addObject(iconButton);
        // let i_icon = 0;

        // iconButton.on('click', (event) => {
        //     console.log('Button down event', event);
        //     if (++i_icon === 5) this.disposeObject(iconButton);
        // });

        // new Tween({})
        //     .onUpdate(alpha => console.log(alpha))
        //     .start()

        // const optionList = [
        //     {body: 'False', key: 'False'},
        //     {body: 'True', key: 'True'},
        //     {body: 'option 333333', key: '3'},
        //     {body: 'option 3333333333333', key: '4'},
        // ];



        console.log('Universal agent for template class', modulesProcessor.agents.get(TemplateA));

        // const orbitControls = modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];

        // modulesProcessor.agents.get(Loader).load().then(() => {
            // const hands = modulesProcessor.modules.get(TemplateModule).questHandView;

            // modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
            //     console.log('Button down event', event);
            //     if (++i_window === 5) {
            //         this.disposeObject(_window);
            //         oculusQuestManager?.setXRControllerView(hands);
            //     }
            // });
        // });
    }
}
