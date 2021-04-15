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
// import {DropdownComponent} from '../../../g.frame.components.dropdown/src/DropdownComponent';
import {OculusGoModule} from '@verybigthings/g.frame.oculus.go';
import World = oimo.dynamics.World;
import {GamepadEvents, GamepadModule, GamepadKeyNames} from '@verybigthings/g.frame.common.gamepad';
// import {GamepadKeyNames} from 'g.frame.common.gamepad/build/main/GamepadModel';
// import {GamepadEvents, GamepadModule, GamepadKeyNames} from '@verybigthings/g.frame.common.gamepad';
// import {GamepadKeyNames} from '@verybigthings/g.frame.common.gamepad/build/main/GamepadModel';

export default class ExampleApp extends Bootstrap {
    // private gamepadModule: GamepadModule;
    private circleSlider: CircleSliderComponent;
    private oculusQuestModule: OculusQuestModule;
    private actionController: ActionController;

    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);

        // this.gamepadModule = modulesProcessor.modules.get(GamepadModule);
        // console.log('gamepadModule', this.gamepadModule);


        const _world = modulesProcessor.agents.get(Factory).getFactory(World)(null);
        console.log('_world', _world);

        const _window = modulesProcessor.agents.get(Factory).getFactory(WindowComponent)({
            size: new Vector2(0.3, 0.3),
            background: 0xffffff
        });


        const w = modulesProcessor.agents.get(Factory).getFactory(WindowComponent);

        _window.uiObject.position.set(-1, 1.5, -1.5);

        this.addObject(_window);

        let i_window = 0;


        const box = new Mesh(new BoxGeometry(0.01, 1, 1), new MeshBasicMaterial({color: '#ff3333'}));
        box.position.set(-1.5, 1.5, -1.5);

        this.oculusQuestModule = modulesProcessor.modules.get(OculusQuestModule);
        const oculusGoManager = modulesProcessor.modules.get(OculusGoModule).oculusGoManager;
        const oculusQuestManager = this.oculusQuestModule.oculusQuestManager;

        this.addObject(box);

        let i_box = 0;

        this.actionController = modulesProcessor.agents.get(ActionController);
        this.actionController.on(ActionControllerEventName.buttonDown, box, (event) => {
            console.log('Button down event', event);
            if (++i_box === 5) {
                this.disposeObject(box);
                oculusGoManager?.setXRControllerView(null);
                oculusQuestManager?.setXRControllerView(null);
            }

            if (this.oculusQuestModule.oculusQuestModel) {
                this.oculusQuestModule.oculusQuestModel.vibrate(300);
            }
        });

        const iconButton = modulesProcessor.agents.get(Factory).getFactory(IconButtonComponent)({
            text: '+',
            background: new Color(0xeeaa88).getStyle(),
            iconSize: 0.6,
            diameter: 0.1
        });

        iconButton.uiObject.position.set(-0.7, 1.5, -1.5);

        this.addObject(iconButton);
        let i_icon = 0;

        iconButton.on('click', (event) => {
            console.log('Button down event', event);
            if (++i_icon === 5) this.disposeObject(iconButton);
        });

        new Tween({})
            .onUpdate(alpha => console.log(alpha))
            .start();

        const optionList = [
            {body: 'False', key: 'False'},
            {body: 'True', key: 'True'},
            {body: 'option 333333', key: '3'},
            {body: 'option 3333333333333', key: '4'},
        ];
        // @ts-ignore
        // const dropdownComponent = modulesProcessor.agents.get(Factory).getFactory(DropdownComponent)({
        //     // size: new Vector2(3, 1),
        //     optionList: optionList,
        //     defaultSelectedOptionId: 1,
        //     fontSize: '44px',
        //     headStyle: {
        //         color: '#000000',
        //         selectedFontSize: '170px',
        //         // // bgColor: '#dddddd',
        //         // bgColor: '#fff0bf',
        //         // bordRadius: 1,
        //         headerWrap: modulesProcessor.agents.get(Factory).getFactory(WindowComponent)({
        //             size: new Vector2(6, 2),
        //             bordColor: 0x888888,
        //             background: 0xfff0bf,
        //             bordWidth: 0,
        //             bordRadius: 1
        //         }).uiObject,
        //         arrowComponent: modulesProcessor.agents.get(Factory).getFactory(TextComponent)({
        //             size: new Vector2(12, 2),
        //             pxSize: new Vector2(512, 256 / 3),
        //             text: {
        //                 style: {
        //                     size: '35px',
        //                     weight: '400', family: 'FontAwesome',
        //                     color: '#ffd652',
        //                 },
        //                 lineHeight: parseInt('35px') * 0.7,
        //                 autoWrappingHorizontal: true,
        //                 autoWrapping: true,
        //                 value: '',
        //                 // margin: {right: 35},
        //             },
        //             background: {color: '#fff0bf'}
        //         }),
        //         headSideOffset: 0.8,
        //         arrowSymbols: {
        //             opened: '⬆',
        //             closed: '⬇',
        //         }
        //     },
        //     optionsStyle: {
        //         disableBorder: false,
        //         margin: {left: 30, right: 30, top: 10, bottom: 11},
        //         bgColor: '#fff0bf',
        //         hoverBorderColor: '#ffd652',
        //     }
        // });
        // dropdownComponent.uiObject.position.set(2, 1.5, -1);
        // dropdownComponent.uiObject.scale.setScalar(0.15);
        // this.addObject(dropdownComponent);

        const orbitControls = modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];
        this.circleSlider = new CircleSliderComponent({
            mode: CircleSliderComponentSlidingMode.onlyClockwise,
            diameter: 1,
            magnetOnSides: 0.05,
            spaceBetweenObjects: 0.02,
            picker: modulesProcessor.agents.get(Factory).getFactory(IconButtonComponent)({
                text: '+',
                background: new Color(0xeeaa88).getStyle(),
                iconSize: 0.6,
                diameter: 0.2
            }),
            filledPart: {
                width: 0.1,
                mainColor: new Color(0x333333)
            },
            unfilledPart: {
                width: 0.1,
                border: 0.02,
                mainColor: new Color(0x666666),
                borderColor: new Color(0x999999)
            }
        }, this.actionController);

        this.circleSlider.on('slideStart', () => orbitControls.enabled = false);
        this.circleSlider.on('slideEnd', () => orbitControls.enabled = true);
        this.circleSlider.uiObject.position.set(0.7, 1.5, -1.5);
        this.addObject(this.circleSlider);

        const inputOptions: IInputComponentOptions = {
            size: new Vector2(0.8 * 2 * 0.3, 0.8 * 0.3),
            pxSize: new Vector2(64 * 2, 64),
            background: 0xffffff,
            bordRadius: 0.01,
            maxLength: 40,
            type: InputType.Full,
            textComponent: {
                text: {
                    value: '',
                    autoWrappingHorizontal: true,
                    autoWrapping: false,
                    style: {family: 'Nunito-Sans', weight: '700', size: '45px', color: 'black'},
                    lineHeight: 45,
                }}
        };

        const inputComponent = modulesProcessor.agents.get(Factory).getFactory(InputComponent)(inputOptions);
        this.addObject(inputComponent);
        inputComponent.uiObject.position.set(0, 1, -1.5);


        console.log(modulesProcessor.modules.get(InputModule).inputManager);


        console.log('Universal agent for template class', modulesProcessor.agents.get(TemplateA));


        modulesProcessor.agents.get(Loader).load().then(() => {
            const hands = modulesProcessor.modules.get(TemplateModule).questHandView;

            this.actionController.on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
                console.log('Button down event', event);
                if (++i_window === 5) {
                    this.disposeObject(_window);
                    oculusQuestManager?.setXRControllerView(hands);
                }
            });
        });

        this.initGamepadEvents();
    }

    initGamepadEvents() {
        // gamepadModule.gamepadController.on(GamepadEvents.keyDown, (event) => {
        //     console.log('EVENT: ', event);
        // });
        //
        // gamepadModule.gamepadController.on(GamepadEvents.keyPressed, (event) => {
        //     console.log('EVENT: ', event);
        // });
        //
        // gamepadModule.gamepadController.on(GamepadEvents.keyUp, (event) => {
        //     console.log('EVENT: ', event);
        // });

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
