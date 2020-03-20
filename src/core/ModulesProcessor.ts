import {EventDispatcher} from './EventDispatcher';
import {AbstractModule, AbstractModuleStatus} from './AbstractModule';
import FrameworkViewer from '../rendering/FrameworkViewer';
import {IViewerConfig} from '../rendering/IViewerConfig';
import {ViewerModule} from './ViewerModule';

interface ModulesProcessorConfiguration {
    modules: Array<AbstractModule>;
    viewerConfig: IViewerConfig;
    bootstrap: ViewerModule;
}

export class ModulesProcessor extends EventDispatcher {
    private modulesStatus: Map<AbstractModule, AbstractModuleStatus>;
    private modulesInstances: Map<AbstractModule, Array<any>>;
    private viewer: FrameworkViewer;


    constructor(private configuration: ModulesProcessorConfiguration) {
        super();
        this.prepareRenderer();
        this.modulesPreInitialization()
            .then(() => this.modulesInitialization())
            .then(() => this.modulesAfterInitialization());

    }

    private async modulesPreInitialization(): Promise<void> {
        for (const module of this.configuration.modules) {
            const status: AbstractModuleStatus = await module.preInit();
            this.modulesStatus.set(module, status);
        }
    }

    private async modulesInitialization(): Promise<void> {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module)) continue;
            const instances: Array<any> = await module.onInit(null);
            this.modulesInstances.set(module, instances);
        }
        // create agents
    }

    private async modulesAfterInitialization(): Promise<void> {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module)) continue;
            module.afterInit();
        }
    }

    private prepareRenderer(): void {
        this.viewer = new Viewer(this.configuration.viewerConfig);
    }

    private update(frame: any) {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module)) continue;
            module.onUpdate({currentTime: performance.now(), frame: frame});
        }
    }

    private destroy() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module)) continue;
            module.onDestroy();
        }
    }

    private pause() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module)) continue;
            module.onPause();
        }
    }

    private resume() {
        for (const module of this.configuration.modules) {
            if (!this.modulesStatus.get(module)) continue;
            module.onResume();
        }
    }
}