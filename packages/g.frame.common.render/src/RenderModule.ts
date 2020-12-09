import {AbstractModule, AbstractModuleStatus, requires} from '@verybigthings/g.frame.core';
import {IViewerConfig} from './interfaces';

const defaultConfig = {
    renderer: {

    },
    scene: {

    },
    camera: {

    },
};

export class RenderModule extends AbstractModule {
    private config: IViewerConfig;

    constructor(config?: IViewerConfig) {
        super();
        this.config = config || defaultConfig;
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

        ];
    }

    afterInit(): void {
        // console.info('Module after initialization. Here you can start save the World.');

        // @ts-ignore
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