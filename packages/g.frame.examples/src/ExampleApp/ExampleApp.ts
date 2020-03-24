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
import IconButtonComponent from '@verybigthings/g.frame.components.buttons/build/main/IconButtonComponent';

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);
        const _window = modulesProcessor.agents.get(Factory).get({
            size: new Vector2(1, 1),
            background: 0xffffff
        }, WindowComponent);

        _window.uiObject.position.set(-1, 5, 0);

        this.addObject(_window);

        let i_window = 0;

        modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
            console.log('Button down event', event);
            if (++i_window == 5) this.disposeObject(_window);
        });


        const box = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial({color: '#ff3333'}));

        box.position.set(-5, 5, 0);

        this.addObject(box);

        let i_box = 0;

        modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, box, (event) => {
            console.log('Button down event', event);
            if (++i_box == 5) this.disposeObject(box);
        });


        const iconButton = modulesProcessor.agents.get(Factory).get({
            text: '+',
            background: new Color(0xeeaa88).getStyle(),
            iconSize: 0.6,
            diameter: 0.7
        }, IconButtonComponent);

        iconButton.uiObject.position.set(-3, 5, 0);

        this.addObject(iconButton);
        let i_icon = 0;

        iconButton.on('click', (event) => {
            console.log('Button down event', event);
            if (++i_icon == 5) this.disposeObject(iconButton);
        });


        console.log('Universal agent for template class', modulesProcessor.agents.get(TemplateA));
    }
}