import {BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector2} from 'three';
import {Bootstrap, Factory, ModulesProcessor, ParentEvent} from '@verybigthings/g.frame.core';
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
import World = oimo.dynamics.World;
import {DropdownComponent} from '../../../g.frame.components.dropdown/src/DropdownComponent';
import {TextComponent} from '@verybigthings/g.frame.components.text';
import { OculusGoModule } from '@verybigthings/g.frame.oculus.go';
import { Level } from '@verybigthings/g.frame.common.level_manager/src';

export default class TemplateExample extends Level {
    private modulesProcessor: ModulesProcessor;

    constructor(modulesProcessor: ModulesProcessor) {
        super();
        this.modulesProcessor = modulesProcessor;
    }

    init(event: ParentEvent<string>) {
        super.init(event);
        const _world = this.modulesProcessor.agents.get(Factory).getFactory(World)(null);
        console.log('_world', _world);

        const _window = this.modulesProcessor.agents.get(Factory).getFactory(WindowComponent)({
            size: new Vector2(0.3, 0.3),
            background: 0xffffff
        });

        const w = this.modulesProcessor.agents.get(Factory).getFactory(WindowComponent);

        _window.uiObject.position.set(-1, 1.5, -1.5);

        this.addObject(_window);

        let i_window = 0;


        const box = new Mesh(new BoxGeometry(0.01, 1, 1), new MeshBasicMaterial({color: '#ff3333'}));

        box.position.set(-1.5, 1.5, -1.5);

        const oculusGoManager = this.modulesProcessor.modules.get(OculusGoModule).oculusGoManager;
        const oculusQuestManager = this.modulesProcessor.modules.get(OculusQuestModule).oculusQuestManager;

        this.modulesProcessor.viewer.scene.add(box);
        // this.addObject(box);

        let i_box = 0;

        this.modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, box, (event) => {
            console.log('Button down event', event);
            if (++i_box === 5) {
                this.disposeObject(box);
                oculusGoManager?.setXRControllerView(null);
                oculusQuestManager?.setXRControllerView(null);
            }
        });

        const iconButton = this.modulesProcessor.agents.get(Factory).getFactory(IconButtonComponent)({
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


        const optionList = [
            {body: 'False', key: 'False'},
            {body: 'True', key: 'True'},
            {body: 'option 333333', key: '3'},
            {body: 'option 3333333333333', key: '4'},
        ];
        // @ts-ignore
        const dropdownComponent = this.modulesProcessor.agents.get(Factory).getFactory(DropdownComponent)({
            // size: new Vector2(3, 1),
            optionList: optionList,
            defaultSelectedOptionId: 1,
            fontSize: '44px',
            headStyle: {
                color: '#000000',
                selectedFontSize: '170px',
                // // bgColor: '#dddddd',
                // bgColor: '#fff0bf',
                // bordRadius: 1,
                headerWrap: this.modulesProcessor.agents.get(Factory).getFactory(WindowComponent)({
                    size: new Vector2(6, 2),
                    bordColor: 0x888888,
                    background: 0xfff0bf,
                    bordWidth: 0,
                    bordRadius: 1
                }).uiObject,
                arrowComponent: this.modulesProcessor.agents.get(Factory).getFactory(TextComponent)({
                    size: new Vector2(12, 2),
                    pxSize: new Vector2(512, 256 / 3),
                    text: {
                        style: {
                            size: '35px',
                            weight: '400', family: 'FontAwesome',
                            color: '#ffd652',
                        },
                        lineHeight: parseInt('35px') * 0.7,
                        autoWrappingHorizontal: true,
                        autoWrapping: true,
                        value: '',
                        // margin: {right: 35},
                    },
                    background: {color: '#fff0bf'}
                }),
                headSideOffset: 0.8,
                arrowSymbols: {
                    opened: '⬆',
                    closed: '⬇',
                }
            },
            optionsStyle: {
                disableBorder: false,
                margin: {left: 30, right: 30, top: 10, bottom: 11},
                bgColor: '#fff0bf',
                hoverBorderColor: '#ffd652',
            }
        });
        dropdownComponent.uiObject.position.set(2, 1.5, -1);
        dropdownComponent.uiObject.scale.setScalar(0.15);
        this.addObject(dropdownComponent);

        const circleSlider = this.modulesProcessor.agents.get(Factory).getFactory(CircleSliderComponent)({
            mode: CircleSliderComponentSlidingMode.onlyClockwise,
            diameter: 1,
            magnetOnSides: 0.05,
            spaceBetweenObjects: 0.02,
            picker: this.modulesProcessor.agents.get(Factory).getFactory(IconButtonComponent)({
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
        });
        const orbitControls = this.modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];
        circleSlider.on('slideStart', () => {
            orbitControls.enabled = false;
        });
        circleSlider.on('slideEnd', () => {
            orbitControls.enabled = true;
        });

        circleSlider.uiObject.position.set(0.7, 1.5, -1.5);

        this.addObject(circleSlider);

        const inputOptions: IInputComponentOptions = {
            size: new Vector2(0.8 * 2 * 0.3, 0.8 * 0.3),
            pxSize: new Vector2(64 * 2, 64),
            background: 0xffffff,
            bordRadius: 0.01,
            maxLength: 40,
            type: InputType.Full,
            text: {
                value: '',
                autoWrappingHorizontal: true,
                autoWrapping: false,
                style: {family: 'Nunito-Sans', weight: '700', size: '45px', color: 'black'},
                lineHeight: 45,
            }
        };

        const inputComponent = this.modulesProcessor.agents.get(Factory).getFactory(InputComponent)(inputOptions);
        this.addObject(inputComponent);
        inputComponent.uiObject.position.set(0, 1, -1.5);



        console.log('Universal agent for template class', this.modulesProcessor.agents.get(TemplateA));


        this.modulesProcessor.agents.get(Loader).load().then(() => {
            const hands = this.modulesProcessor.modules.get(TemplateModule).questHandView;

            this.modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
                console.log('Button down event', event);
                if (++i_window === 5) {
                    this.disposeObject(_window);
                    oculusQuestManager?.setXRControllerView(hands);
                }
            });
        });
    }
}