import {AbstractModule, AbstractModuleStatus} from '@verybigthings/g.frame.core';
import {TemplateB} from './TemplateB';
import {TemplateC} from './TemplateC';

const delay = async time => new Promise(resolve => setTimeout(resolve, time));


export class TemplateModule extends AbstractModule {
    constructor() {
        super();
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
            new TemplateB(),
            new TemplateC()
        ];
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