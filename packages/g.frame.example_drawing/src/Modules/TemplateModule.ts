import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import {DrawLevel} from './DrawLevel';
import {Object3D} from 'three';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {PickingController} from '@verybigthings/g.frame.common.picking_controller';
import QuestHandView from './QuestHandView';
import { ActionController } from '@verybigthings/g.frame.common.action_controller';
import { OrbitControls } from '@verybigthings/g.frame.desktop';

const delay = async time => new Promise(resolve => setTimeout(resolve, time));


export class TemplateModule extends AbstractModule {
    public drawLevel: DrawLevel;
    public questHandView: QuestHandView;
    private readonly container: Object3D;

    constructor() {
        super();
        this.container = new Object3D();

        // const scenarios = [
        //     {
        //         instance: new ParticlesExample(this),
        //         name: 'ParticlesExample',
        //         routerLink: '#ParticlesExample',
        //         showPreloader: false,
        //         events: {},
        //     },
        // ];
        //
        // const levelManagerOptions: LevelManagerOptions = {
        //     name: 'VideoPlayer',
        //     scenarios: scenarios,
        //     preloader: false,
        //     preloaderCamera: false
        // };
        //
        //
        // const levelManager = new LevelManager(levelManagerOptions);
    }

    async preInit(): Promise<AbstractModuleStatus> {
        console.info('Module pre initialization.. Just make sure, that module is supported.');
        await delay(100);
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        console.info('Module initialization. Create all instances.');
        return [
            this.drawLevel = new DrawLevel(this.container),
            this.questHandView = new QuestHandView(this.container)
        ];
    }

    getModuleContainer(): Object3D | void {
        return this.container;
    }

    afterInit(agents: ConstructorInstanceMap<any>, modules: ConstructorInstanceMap<AbstractModule>): void {
        this.questHandView.prepareResources(agents.get(Loader));
        this.drawLevel.prepareResources(agents.get(Loader));
        this.drawLevel.setPickingController(agents.get(PickingController));
        this.drawLevel.setActionController(agents.get(ActionController));

        console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
    }

    onDestroy(): void {
        console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}