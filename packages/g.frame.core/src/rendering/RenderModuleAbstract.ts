import {AbstractModule, AbstractModuleStatus} from '../core';
import {IViewerConfig} from './IViewerConfig';

import { ViewerAbstract } from './ViewerAbstract';


export class RenderModuleAbstract extends AbstractModule {
    protected viewer: ViewerAbstract;

    constructor(protected config: IViewerConfig) {
        super();
    }

    async preInit(): Promise<AbstractModuleStatus> {
        // console.info('Module pre initialization.. Just make sure, that module is supported.');
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        return [];
    }

    getViewer(): ViewerAbstract {
        return this.viewer;
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