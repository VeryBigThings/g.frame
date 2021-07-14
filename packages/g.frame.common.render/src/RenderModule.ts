import {AbstractModule, AbstractModuleStatus, ViewerAbstract, RenderModuleAbstract, IViewerConfig} from '@g.frame/core';
import { Scene, WebGLRenderer } from 'three';
import { Renderer } from './Render';
import { WEBGLRenderer } from './WEBGLRenderer';


export class RenderModule extends RenderModuleAbstract {
    protected viewer: ViewerAbstract;
    protected webglrenderer: WEBGLRenderer;

    constructor(protected config: IViewerConfig) {
        super(config);
    }

    async preInit(): Promise<AbstractModuleStatus> {
        // console.info('Module pre initialization.. Just make sure, that module is supported.');
        return {
            enabled: true
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        this.viewer = new Renderer(this.config);

        return [
            this.viewer
        ];
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