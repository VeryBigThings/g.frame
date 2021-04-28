import {Bootstrap, Factory, ModulesProcessor, Tween} from '@g.frame/core';
import {Loader} from '@g.frame/common.loaders';

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);

        modulesProcessor.agents.get(Loader).load().then(() => {
            // const hands = modulesProcessor.modules.get(TemplateModule).questHandView;

            // this.actionController.on(ActionControllerEventName.buttonDown, _window.uiObject, (event) => {
            //     console.log('Button down event', event);
            //     if (++i_window === 5) {
            //         this.disposeObject(_window);
            //         oculusQuestManager?.setXRControllerView(hands);
            //     }
            // });
        });
    }

}
