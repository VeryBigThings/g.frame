
import { LevelManagerOptions } from '@verybigthings/g.frame.common.level_manager/src/LevelManager_interfaces';
import { LevelManager } from '@verybigthings/g.frame.common.level_manager/src';
import PhysicsGravityExample from '../examples/PhysicsGravityExample';
import PhysicsJointsExample from '../examples/PhysicsBreakableJointExample';
import PhysicsBreakableJointExample from '../examples/PhysicsBreakableJointExample';
import { Bootstrap, ModulesProcessor } from '@verybigthings/g.frame.core';
import { Loader } from '@verybigthings/g.frame.common.loaders';
import TemplateExample from '../examples/TemplateExample';

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();
    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);

        const scenarios = [
            {
                instance: new TemplateExample(modulesProcessor),
                name: 'TemplateExample',
                routerLink: '#TemplateExample',
                showPreloader: false,
                events: {},
            },
            // {
            //     instance: new PhysicsJointsExample(modulesProcessor),
            //     name: 'PhysicsJointsExample',
            //     routerLink: '#PhysicsJointsExample',
            //     showPreloader: false,
            //     events: {},
            // },
            // {
            //     instance: new PhysicsBreakableJointExample(modulesProcessor),
            //     name: 'PhysicsBreakableJointExample',
            //     routerLink: '#PhysicsBreakableJointExample',
            //     showPreloader: false,
            //     events: {},
            // },
            // {
            //     instance: new PhysicsGravityExample(modulesProcessor),
            //     name: 'PhysicsGravityExample',
            //     routerLink: '#PhysicsGravityExample',
            //     showPreloader: false,
            //     events: {},
            // },
        ];

        const levelManagerOptions: LevelManagerOptions = {
            name: 'VideoPlayer',
            scenarios: scenarios
        };

        const levelManager = new LevelManager(levelManagerOptions, modulesProcessor.agents.get(Loader));
    }
}