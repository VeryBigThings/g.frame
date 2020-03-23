import {BoxGeometry, Mesh, MeshBasicMaterial} from 'three';
import {Bootstrap, ModulesProcessor} from '@verybigthings/g.frame.core';
import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.core';
import {TemplateA} from '../Modules/TemplateA';

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        const box = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial({color: '#ff3333'}));

        this.addObject(box);

        modulesProcessor.agents.get(ActionController).on(ActionControllerEventName.buttonDown, box, (event) => {
            console.log('Button down event', event);
        });


        console.log('Universal agent for template class', modulesProcessor.agents.get(TemplateA));
    }
}