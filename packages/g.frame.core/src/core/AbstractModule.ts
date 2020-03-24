import {EventDispatcher} from './EventDispatcher';
import {AgentsStorage} from '../agents/AgentsStorage';

export interface AbstractModuleStatus {
    enabled: boolean;
}

export abstract class AbstractModule extends EventDispatcher {
    /**
     * Map of instances, that are owned by this module
     */
    protected instances: Map<string, any>;

    /**
     * Function to get instance from current module
     * @param name Name of instance. Check the documentation of module
     */
    public getInstance(name: string) {
        return this.instances.get(name);
    }

    /**
     * Function, that is called before actual initialization. Use it to check hardware, check compatibility, etc.
     * @returns Promise of Module status. For example if this module supported by user's hardware?
     */
    async abstract preInit(): Promise<AbstractModuleStatus>;

    /**
     * Initialization of module. All instances have to be created in this function.
     * @param data Data from g.frame core.
     * @todo Describe data argument in initialization function
     * @returns Promise of instances array
     */
    async abstract onInit(data: any): Promise<Array<any>>;

    /**
     * Function that is called after initialization. Use it only for internal stuff.
     */
    abstract afterInit(agents: AgentsStorage): void;

    /**
     * Update function for module. Use only this function for all updates.
     * @param params Current frame information
     * @param params.currentTime Time in milliseconds from starts
     * @param params.frame Current XRFrame for WebXR
     * @todo When typescript will have WebXR API declarations -- put frame: XRFrame
     */
    abstract onUpdate(params: { currentTime: number, frame: any }): void;

    /**
     * Function that is called before actual destruction. All resources should be disposed and removed.
     */
    abstract onDestroy(): void;

    /**
     * Function that is called when application is paused (For example tab is changed)
     */
    abstract onPause(): void;

    /**
     * Function that is called when application is resumed
     */
    abstract onResume(): void;
}