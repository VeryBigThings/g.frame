import {BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector2} from 'three';
import {Bootstrap, Factory, ModulesProcessor, Tween} from 'g.frame.core';
import {TemplateA} from '../Modules/TemplateA';
import {WindowComponent} from 'g.frame.components.window';
import {IconButtonComponent} from 'g.frame.components.buttons';
import {CircleSliderComponent, CircleSliderComponentSlidingMode} from 'g.frame.components.sliders';
import {DesktopModule, OrbitControls} from 'g.frame.desktop';
import {InputModule, InputType} from 'g.frame.input';
import {IInputComponentOptions, InputComponent} from 'g.frame.components.input';
import {ActionController, ActionControllerEventName} from 'g.frame.common.action_controller';
import {Loader} from 'g.frame.common.loaders';
import {TemplateModule} from '../Modules/TemplateModule';
import {OculusQuestModule} from 'g.frame.oculus.quest';
import {oimo} from 'oimophysics';
// import {DropdownComponent} from '../../../g.frame.components.dropdown/src/DropdownComponent';
import {TextComponent} from 'g.frame.components.text';
import {OculusGoModule} from 'g.frame.oculus.go';
import {PickingController} from 'g.frame.common.picking_controller';
import World = oimo.dynamics.World;
import {OimoPhysicsModule, PhysicMeshLinkType} from 'g.frame.physics.oimo';
import OimoUtil from 'g.frame.physics.oimo/build/main/oimo.utils/OimoUtil';

export default class ExampleApp extends Bootstrap {
    constructor() {
        super();

    }

    onInit(modulesProcessor: ModulesProcessor) {
        super.onInit(modulesProcessor);
        console.log(modulesProcessor);

        const _world = modulesProcessor.agents.get(Factory).getFactory(World)(null);
        console.log('_world', _world);

        const _window = modulesProcessor.agents.get(Factory).getFactory(WindowComponent)({
            size: new Vector2(0.3, 0.3),
            background: 0xffffff
        });




        const physModule = modulesProcessor.modules.get(OimoPhysicsModule);
        console.log('physModule', physModule);

        const floor = new Mesh(new BoxGeometry(0.8, 0.1, 0.8));
        const floor_phys = OimoUtil.addBox(_world, new oimo.common.Vec3(), new oimo.common.Vec3(0.8 / 2, 0.1 / 2, 0.8 / 2), true);

        const cube = new Mesh(
            new BoxGeometry(0.2, 0.2, 0.2),
            new MeshBasicMaterial({color: 'red'})
        );
        const box_phys = OimoUtil.addBox(_world, new oimo.common.Vec3(0, 1.5, 0), new oimo.common.Vec3(0.2 / 2, 0.2 / 2, 0.2 / 2), false);

        // @ts-ignore
        physModule.physicMeshUpdater.register(cube, box_phys, PhysicMeshLinkType.RIGID_BODY_MESH_FULL);
        // physModule.physicMeshUpdater.register(floor, floor_phys, PhysicMeshLinkType.RIGID_BODY_MESH_FULL);
        cube.position.y = 1.5;

        console.log('floor', floor);
        console.log('cube', cube);
        this.addObject(cube);
        this.addObject(floor);
    }
}
