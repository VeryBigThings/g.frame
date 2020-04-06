import { AbstractModule, AbstractModuleStatus, ConstructorInstanceMap } from '@verybigthings/g.frame.core';
import { Loader } from '@verybigthings/g.frame.common.loaders';
import { Object3D } from 'three';
import { OculusGoActionController } from './Controllers/OculusGoActionController';
import { InputSourceController } from './MVC/InputSourceController';
import { OculusGoModel } from './MVC/OculusGoModel';
import { OculusGoViewChanger } from './MVC/View/OculusGoViewChanger';

export class OculusGoModule extends AbstractModule {
    public inputSourceController: InputSourceController;
    public oculusGoViewChanger: OculusGoViewChanger;
    private readonly moduleContainer: Object3D;

    constructor() {
        super();
        this.moduleContainer = new Object3D();
        this.moduleContainer.name = 'OCULUS_GO_CONTAINER';
    }

    async preInit(): Promise<AbstractModuleStatus> {
        return {
            enabled: this.checkGoBrowser() && this.checkXRSupport(),
        };
    }

    async onInit(data: any): Promise<Array<any>> {
        // Init Model
        const oculusGoModel = new OculusGoModel(data.viewer);

        // Init ViewChanger
        this.oculusGoViewChanger = new OculusGoViewChanger(oculusGoModel);
        this.oculusGoViewChanger.setCurrentView();

        // Init ActionController
        const actionController = new OculusGoActionController({
            minRaycasterDistance: 0,
            maxRaycasterDistance: Infinity
        }, oculusGoModel);

        // Init Controller
        this.inputSourceController = new InputSourceController(data.viewer.renderer, oculusGoModel);

        this.moduleContainer.add(oculusGoModel.mainContainer);

        return [
            this.inputSourceController,
            actionController,
        ];
    }

    afterInit(agents: ConstructorInstanceMap<any>): void {
        this.oculusGoViewChanger.prepareResources(agents.get(Loader));
    }

    getModuleContainer(): Object3D {
        return this.moduleContainer;
    }

    onUpdate(params: { currentTime: number; frame: any }): void {
        this.inputSourceController.manipulateModel(params);
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