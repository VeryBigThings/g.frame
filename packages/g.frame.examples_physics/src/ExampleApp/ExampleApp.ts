import {Bootstrap, Factory, ModulesProcessor, Tween} from '@verybigthings/g.frame.core';
import {DesktopModule, OrbitControls} from '@verybigthings/g.frame.desktop';

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();

    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);

        const orbitControls = modulesProcessor.modulesInstances.get(DesktopModule).filter(instance => instance instanceof OrbitControls)[0];
    }
}