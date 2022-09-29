import {BoxGeometry, Mesh, MeshBasicMaterial} from 'three';
import {Bootstrap, Factory, ModulesProcessor} from '@g.frame/core';
import {DesktopModule, OrbitControls} from '@g.frame/desktop';
import {InputModule, InputType} from '@g.frame/input';
import {Loader} from '@g.frame/common.loaders';


export default class ExampleApp extends Bootstrap {

    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);

        const box = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({color: '#ee4444'}));
        this.addObject(box);
    }
}
