import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from '@g.frame/core';
import {VBTubeVideoPlayerFactory} from './VBTubeVideoPlayerFactory';
import {ActionController} from '@g.frame/common.action_controller';



export class VBTubeVideoPlayerModule extends AbstractModule {
    private vbtubeVideoPlayerFactory: VBTubeVideoPlayerFactory;

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
            this.vbtubeVideoPlayerFactory = new VBTubeVideoPlayerFactory(),
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        const actionController = agents.get(ActionController);
        this.vbtubeVideoPlayerFactory.setActionController(actionController);
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
        this.vbtubeVideoPlayerFactory.update(params);
    }

    onDestroy(): void {
        // console.info('Module destroy function. Use it to destroy and dispose instances.');
    }

    onResume(): void {
    }

    onPause(): void {
    }
}