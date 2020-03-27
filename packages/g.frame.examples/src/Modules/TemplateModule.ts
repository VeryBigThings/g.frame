import {AbstractModule, AbstractModuleStatus} from '@verybigthings/g.frame.core';
import {TemplateB} from './TemplateB';
import {TemplateC} from './TemplateC';
import {Object3D} from 'three';

const delay = async time => new Promise(resolve => setTimeout(resolve, time));


export class TemplateModule extends AbstractModule {
    private readonly container: Object3D;
    private templateB: TemplateB;

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
            this.templateB = new TemplateB(data.resourcesManager, this.container),
            new TemplateC()
        ];
    }

    onResourcesReady(): void {
        this.templateB.addResources();
    }

    getModuleContainer(): Object3D | void {
        return this.container;
    }

    afterInit(): void {
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