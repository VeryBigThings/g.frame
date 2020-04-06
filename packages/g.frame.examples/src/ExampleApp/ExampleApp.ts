import {BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector2} from 'three';
import {Bootstrap, Factory, ModulesProcessor} from '@verybigthings/g.frame.core';
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
import { OculusGoModule } from '@verybigthings/g.frame.oculus.go';

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);
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

        const oculusGoViewChanger = modulesProcessor.modules.get(OculusGoModule).oculusGoViewChanger;
        const oculusQuestViewChanger = modulesProcessor.modules.get(OculusQuestModule).oculusQuestViewChanger;

        this.addObject(box);

        let i_box = 0;

        modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, box, (event) => {
            console.log('Button down event', event);
            if (++i_box === 5) {
                this.disposeObject(box);
                oculusGoViewChanger?.setCurrentView();
                oculusQuestViewChanger?.setPreviousView();
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


        const circleSlider = modulesProcessor.agents.get(Factory).getFactory(CircleSliderComponent)({
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
        });
        const orbitControls = modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];
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

        const inputComponent = modulesProcessor.agents.get(Factory).getFactory(InputComponent)(inputOptions);
        this.addObject(inputComponent);
        inputComponent.uiObject.position.set(0, 1, -1.5);


        console.log(modulesProcessor.modules.get(InputModule).inputManager);


        console.log('Universal agent for template class', modulesProcessor.agents.get(TemplateA));


        modulesProcessor.agents.get(Loader).load().then(() => {
            const hands = modulesProcessor.modules.get(TemplateModule).questHandView;

            modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
                console.log('Button down event', event);
                if (++i_window === 5) {
                    this.disposeObject(_window);
                    // questModel?.setView(hands);
                    oculusQuestViewChanger?.setNewView(hands);

                    oculusGoViewChanger?.removeView();
                }
            });
        });
    }
}