import { AbstractModule, AbstractModuleStatus, ConstructorInstanceMap } from '@verybigthings/g.frame.core';
import { Loader } from '@verybigthings/g.frame.common.loaders';
import { Object3D } from 'three';
import { OculusGoActionController } from './OculusGoControllers/OculusGoActionController';
import { OculusGoManager } from './OculusGoManager';
import { OculusGoModel } from './OculusGoModel';

export class OculusGoModule extends AbstractModule {
    public oculusGoManager: OculusGoManager;
    private readonly container: Object3D;

    constructor() {
        super();
        this.container = new Object3D();
        this.container.name = 'OculusGoModuleContainer';
    }

    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: this.checkGoBrowser() && this.checkXRSupport(),
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        // Init Model
        const oculusGoModel = new OculusGoModel(data.viewer);

        // Init ActionController
        const actionController = new OculusGoActionController({
            minRaycasterDistance: 0,
            maxRaycasterDistance: Infinity
        }, oculusGoModel);

        // Init Controller
        this.oculusGoManager = new OculusGoManager(data.viewer.renderer, oculusGoModel);
        this.container.add(oculusGoModel.mainContainer);

        return [
            this.oculusGoManager,
            actionController,
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.oculusGoManager.prepareResources(agents.get(Loader));
    }

    getModuleContainer(): Object3D {
        return this.container;
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        this.oculusGoManager.manipulateModel(params);
    }

    onDestroy(): void {
    }

    onResume(): void {
    }

    onPause(): void {
    }

    private checkGoBrowser() {
        const uaToken = 'Pacific';
        return !!navigator.userAgent.match(uaToken);
    }

    private checkXRSupport() {
        // @ts-ignore
        return navigator?.xr?.isSessionSupported instanceof Function;
    }
}