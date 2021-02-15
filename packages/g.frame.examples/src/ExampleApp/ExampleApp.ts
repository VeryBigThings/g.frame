import {BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector2} from 'three';
import {Bootstrap, Factory, ModulesProcessor, Tween} from '@verybigthings/g.frame.core';
import {TemplateA} from '../Modules/TemplateA';
import {WindowComponent} from '@verybigthings/g.frame.components.window';
import {IconButtonComponent} from '@verybigthings/g.frame.components.buttons';
import {CircleSliderComponent, CircleSliderComponentSlidingMode} from '@verybigthings/g.frame.components.sliders';
import {DesktopModule, OrbitControls} from '@verybigthings/g.frame.desktop';
import {InputModule, InputType} from '@verybigthings/g.frame.input';
import {IInputComponentOptions, InputComponent} from '@verybigthings/g.frame.components.input';
import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {TemplateModule} from '../Modules/TemplateModule';
import {OculusQuestModule} from '@verybigthings/g.frame.oculus.quest';
import {oimo} from 'oimophysics';
import {DropdownComponent} from '../../../g.frame.components.dropdown/src/DropdownComponent';
import {TextComponent} from '@verybigthings/g.frame.components.text';
import {OculusGoModule} from '@verybigthings/g.frame.oculus.go';
import {PickingController} from '@verybigthings/g.frame.common.picking_controller';
import World = oimo.dynamics.World;

export default class ExampleApp extends Bootstrap {
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


        // const w = modulesProcessor.agents.get(Factory).getFactory(WindowComponent);

        // _window.uiObject.position.set(-1, 1.5, -1.5);

        // this.addObject(_window);

        // let i_window = 0;


        const box = new Mesh(new BoxGeometry(0.01, 1, 1), new MeshBasicMaterial({color: '#ff3333'}));

        box.position.set(-1.5, 1.5, -1.5);

        // const oculusGoManager = modulesProcessor.modules.get(OculusGoModule).oculusGoManager;
        // const oculusQuestManager = modulesProcessor.modules.get(OculusQuestModule).oculusQuestManager;

        this.addObject(box);

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