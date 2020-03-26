import {BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector2} from 'three';
import {
    ActionController,
    ActionControllerEventName,
    Bootstrap,
    Factory,
    ModulesProcessor
} from '@verybigthings/g.frame.core';
import {TemplateA} from '../Modules/TemplateA';
import {WindowComponent} from '@verybigthings/g.frame.components.window';
import {IconButtonComponent} from '@verybigthings/g.frame.components.buttons';
import {CircleSliderComponent, CircleSliderComponentSlidingMode} from '@verybigthings/g.frame.components.sliders';
import {DesktopModule, OrbitControls} from '@verybigthings/g.frame.desktop';
import {InputModule, InputType} from '@verybigthings/g.frame.input';
import {IInputComponentOptions, InputComponent} from '@verybigthings/g.frame.components.input';

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);
        const _window = modulesProcessor.agents.getAgent(Factory).getFactory(WindowComponent)({
            size: new Vector2(1, 1),
            background: 0xffffff
        });

        const w = modulesProcessor.agents.getAgent(Factory).getFactory(WindowComponent);

        _window.uiObject.position.set(-1, 5, 0);

        this.addObject(_window);

        let i_window = 0;

        modulesProcessor.agents.getAgent(ActionController).on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
            console.log('Button down event', event);
            if (++i_window === 5) this.disposeObject(_window);
        });


        const box = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial({color: '#ff3333'}));

        box.position.set(-5, 5, 0);

        this.addObject(box);

        let i_box = 0;

        modulesProcessor.agents.getAgent(ActionController).on(ActionControllerEventName.buttonDown, box, (event) => {
            console.log('Button down event', event);
            if (++i_box === 5) this.disposeObject(box);
        });


        const iconButton = modulesProcessor.agents.getAgent(Factory).getFactory(IconButtonComponent)({
            text: '+',
            background: new Color(0xeeaa88).getStyle(),
            iconSize: 0.6,
            diameter: 0.7
        });

        iconButton.uiObject.position.set(-3, 5, 0);

        this.addObject(iconButton);
        let i_icon = 0;

        iconButton.on('click', (event) => {
            console.log('Button down event', event);
            if (++i_icon === 5) this.disposeObject(iconButton);
        });


        const circleSlider = modulesProcessor.agents.getAgent(Factory).getFactory(CircleSliderComponent)({
            mode: CircleSliderComponentSlidingMode.onlyClockwise,
            diameter: 2.5,
            magnetOnSides: 0.05,
            spaceBetweenObjects: 0.02,
            picker: modulesProcessor.agents.getAgent(Factory).getFactory(IconButtonComponent)({
                text: '+',
                background: new Color(0xeeaa88).getStyle(),
                iconSize: 0.6,
                diameter: 0.6
            }),
            filledPart: {
                width: 0.35,
                mainColor: new Color(0x333333)
            },
            unfilledPart: {
                width: 0.35,
                border: 0.1,
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

        circleSlider.uiObject.position.set(3, 5, 0);

        this.addObject(circleSlider);

        const inputOptions: IInputComponentOptions = {
            size: new Vector2(0.8 * 2, 0.8),
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

        const inputComponent = modulesProcessor.agents.getAgent(Factory).getFactory(InputComponent)(inputOptions);
        this.addObject(inputComponent)


        console.log(modulesProcessor.modules.getModule(InputModule).inputManager);


        console.log('Universal agent for template class', modulesProcessor.agents.getAgent(TemplateA));
    }
}