import {AbstractModule, AbstractModuleStatus, RenderAbstract, requires} from '@verybigthings/g.frame.core';
import { Scene, WebGLRenderer } from 'three';
import {IViewerConfig} from './interfaces';
import { Renderer } from './Render';
import { WEBGLRenderer } from './'


export class RenderModule extends AbstractModule {
    private viewer: RenderAbstract;

    constructor(private config: IViewerConfig) {
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

        this.webglrenderer = new WEBGLRenderer(this.config.renderer);
        this.viewer = new Renderer(this.config);

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