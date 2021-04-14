import {AbstractModule, AbstractModuleStatus, ConstructorInstanceMap} from 'g.frame.core';
import AudiosLoader from './default/AudiosLoader';
import PositionalAudiosLoader from './default/PositionalAudiosLoader';
import FontsLoader from './default/FontsLoader';
import FBXModelsLoader from './default/FBXModelsLoader';
import DAEModelsLoader from './default/DAEModelsLoader';
import GLTFModelsLoader from './default/GLTFModelsLoader';
import OBJModelsLoader2 from './default/OBJ2ModelsLoader';
import OBJModelsLoader from './default/OBJModelsLoader';
import JSONModelsLoader from './default/JSONModelsLoader';
import TexturesLoader from './default/TexturesLoader';
import VideosLoader from './default/VideosLoader';
import {Loader} from './Loader';

export class LoadersModule extends AbstractModule {
    private loaders: Array<Loader<any>>;

    constructor(private config: {
        disposeAssets?: boolean
    } = {disposeAssets: true}) {
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
        this.loaders = [
            new AudiosLoader(),
            new PositionalAudiosLoader(),
            new FontsLoader(),
            new FBXModelsLoader(),
            new DAEModelsLoader(),
            new GLTFModelsLoader(),
            new OBJModelsLoader(),
            new OBJModelsLoader2(),
            new DAEModelsLoader(),
            new JSONModelsLoader(),
            new TexturesLoader(),
            new VideosLoader()
        ];
        return this.loaders.slice();
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        // console.info('Module on update function. Use it to update instances.');
    }

    onDestroy(): void {
        if (this.config.disposeAssets)
            this.loaders.forEach(loader => loader.dispose());
    }

    onResume(): void {
    }

    onPause(): void {
    }
}
