import { EventDispatcher } from './ts/core/EventDispatcher';

interface XRFrame {}

interface FrameworkModuleStatus {
    enabled: boolean;
}

abstract class FrameworkModule extends EventDispatcher {
    protected instances: Map<string, any>;
    public getInstance(name: string) {
        return this.instances.get(name);
    }
    async abstract preInit(): Promise<FrameworkModuleStatus>;
    async abstract onInit(data: any): Promise<Array<any>>;
    abstract afterInit(): void;
    abstract onUpdate(params: { currentTime: number, frame: XRFrame }): void;
    abstract onDestroy(): void;
    abstract onPause(): void;
    abstract onResume(): void;
}

abstract class Framework {
    private modulesStatus: Map<FrameworkModule, FrameworkModuleStatus>;
    private modulesInstances: Map<FrameworkModule, Array<any>>;

    private configuration: {
        modules: Array<FrameworkModule>,
        // config: IConfig,
        // bootstrap: Array<ViewerModule>
    };

    constructor(configuration) {
        this.modulesPreInitialization();
    }

    private async modulesPreInitialization(): Promise<void> {
        for (const module of this.configuration.modules) {
            const status: FrameworkModuleStatus = await module.preInit();
            this.modulesStatus.set(module, status);
        }
    }

    private async modulesInitialization(): Promise<void> {
        for (const module of this.configuration.modules) {
            const instances: Array<any> = await module.onInit(null);
            this.modulesInstances.set(module, instances);
        }
        // create agents
    }
    private async prepareRenderer(): Promise<void> {
    }
    private update() {
    }
    private destroy() {
    }
}