import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import {TemplateB} from './TemplateB';
import {TemplateC} from './TemplateC';
import {Object3D} from 'three';
import {Loader} from '@verybigthings/g.frame.common.loaders';
import {PickingController} from '@verybigthings/g.frame.common.picking_controller';
import QuestHandView from './QuestHandView';

const delay = async time => new Promise(resolve => setTimeout(resolve, time));

export class TemplateModule extends AbstractModule {
    public templateB: TemplateB;
    public questHandView: QuestHandView;
    private readonly container: Object3D;

    /**
     * Constructor of the TemplateModule.
     * Here you can see how your module should work
     */
    constructor() {
        super();
        this.container = new Object3D();
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
            this.templateB = new TemplateB(this.container),
            new TemplateC(),
            this.questHandView = new QuestHandView(this.container)
        ];
    }

    getModuleContainer(): Object3D | void {
        return this.container;
    }

    afterInit(agents: ConstructorInstanceMap<any>, modules: ConstructorInstanceMap<AbstractModule>): void {
        this.questHandView.prepareResources(agents.get(Loader));
        this.templateB.prepareResources(agents.get(Loader));
        this.templateB.setPickingController(agents.get(PickingController));

        // console.info('Module after initialization. Here you can start save the World.');
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
    }

    onDestroy(): void {
        // console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}