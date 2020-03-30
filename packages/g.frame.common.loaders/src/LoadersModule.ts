import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@verybigthings/g.frame.core';
import AudiosLoader from './default/AudiosLoader';
import PositionalAudiosLoader from './default/PositionalAudiosLoader';
import FontsLoader from './default/FontsLoader';
import ModelsLoader from './default/ModelsLoader';
import TexturesLoader from './default/TexturesLoader';
import VideosLoader from './default/VideosLoader';

export class LoadersModule extends AbstractModule {
    constructor() {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        // console.info('Module pre initialization.. Just make sure, that module is supported.');
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        // console.info('Module initialization. Create all instances.');
        return [
            new AudiosLoader(),
            new PositionalAudiosLoader(),
            new FontsLoader(),
            new ModelsLoader(),
            new TexturesLoader(),
            new VideosLoader()
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
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