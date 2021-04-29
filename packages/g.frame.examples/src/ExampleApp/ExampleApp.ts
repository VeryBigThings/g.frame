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
// import {OculusQuestModule} from '@g.frame/oculus.quest';
import {oimo} from 'oimophysics';
// import {DropdownComponent} from '../../../g.frame.components.dropdown/src/DropdownComponent';
import {OculusGoModule} from '@g.frame/oculus.go';
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



        // const box = new Mesh(new BoxGeometry(0.01, 1, 1), new MeshBasicMaterial({color: '#ff3333'}));
        // box.position.set(-1.5, 1.5, -1.5);

        // this.addObject(box);

        // this.actionController = modulesProcessor.agents.get(ActionController);

        // this.actionController.on(ActionControllerEventName.buttonDown, box, (event) => {
        //     console.log('Button down event', event);

        // });
        // dropdownComponent.uiObject.position.set(2, 1.5, -1);
        // dropdownComponent.uiObject.scale.setScalar(0.15);
        // this.addObject(dropdownComponent);

        // const orbitControls = modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];
        // this.circleSlider = new CircleSliderComponent({
        //     mode: CircleSliderComponentSlidingMode.onlyClockwise,
        //     diameter: 1,
        //     magnetOnSides: 0.05,
        //     spaceBetweenObjects: 0.02,
        //     picker: modulesProcessor.agents.get(Factory).getFactory(IconButtonComponent)({
        //         text: '+',
        //         background: new Color(0xeeaa88).getStyle(),
        //         iconSize: 0.6,
        //         diameter: 0.2
        //     }),
        //     filledPart: {
        //         width: 0.1,
        //         mainColor: new Color(0x333333)
        //     },
        //     unfilledPart: {
        //         width: 0.1,
        //         border: 0.02,
        //         mainColor: new Color(0x666666),
        //         borderColor: new Color(0x999999)
        //     }
        // }, this.actionController);

        // this.circleSlider.on('slideStart', () => orbitControls.enabled = false);
        // this.circleSlider.on('slideEnd', () => orbitControls.enabled = true);
        // this.circleSlider.uiObject.position.set(0.7, 1.5, -1.5);
        // this.addObject(this.circleSlider);

        // const inputOptions: IInputComponentOptions = {
        //     size: new Vector2(0.8 * 2 * 0.3, 0.8 * 0.3),
        //     pxSize: new Vector2(64 * 2, 64),
        //     background: 0xffffff,
        //     bordRadius: 0.01,
        //     maxLength: 40,
        //     type: InputType.Full,
        //     textComponent: {
        //         text: {
        //             value: '',
        //             autoWrappingHorizontal: true,
        //             autoWrapping: false,
        //             style: {family: 'Nunito-Sans', weight: '700', size: '45px', color: 'black'},
        //             lineHeight: 45,
        //         }}
        // };

        // const inputComponent = modulesProcessor.agents.get(Factory).getFactory(InputComponent)(inputOptions);
        // this.addObject(inputComponent);
        // inputComponent.uiObject.position.set(0, 1, -1.5);


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

        // gamepadModule.gamepadController.on(GamepadEvents.keyTouchStart, (event) => {
        //     console.log('EVENT: ', event, event.data.value);
        // });
        //
        // gamepadModule.gamepadController.on(GamepadEvents.keyTouched, (event) => {
        //     console.log('EVENT: ', event, event.data.value);
        // });
        //
        // gamepadModule.gamepadController.on(GamepadEvents.keyTouchEnd, (event) => {
        //     console.log('EVENT: ', event, event.data.value);
        // });


        // this.gamepadModule.gamepadController.on(GamepadEvents.stickChanged, (event) => {
        //     if (event.data.stickName === GamepadKeyNames.stickLeft) {
        //         this.circleSlider.uiObject.position.x += event.data.axes.x / 30;
        //         this.circleSlider.uiObject.position.y -= event.data.axes.y / 30;
        //     }
        //     else if (event.data.stickName === GamepadKeyNames.stickRight) {
        //         this.circleSlider.uiObject.rotation.x += event.data.axes.y / 30;
        //         this.circleSlider.uiObject.rotation.y += event.data.axes.x / 30;
        //     }
        // });
    }
}
