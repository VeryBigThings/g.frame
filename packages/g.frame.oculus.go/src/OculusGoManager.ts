import { XRManager, XRViewStatus } from '@verybigthings/g.frame.common.xr_manager';
import { Loader } from '@verybigthings/g.frame.common.loaders';
import { WebGLRenderer } from 'three';
import { OculusGoModel } from './OculusGoModel';
import { OculusGoView } from './OculusGoView';

export class OculusGoManager extends XRManager {
    protected currentXRControllerView: OculusGoView;
    protected defaultXRControllerView: OculusGoView;
    private inputSource: any;

    constructor(renderer: WebGLRenderer, protected controllerModel: OculusGoModel) {
        super(renderer);
        this.defaultXRControllerView = new OculusGoView();
        this.currentXRControllerView = this.defaultXRControllerView;
        this.setXRControllerView(this.currentXRControllerView);

        this.createButton();
        this.initEvents();
    }

    manipulateModel(params: { currentTime: number; frame: any }) {
        this.controllerModel.manipulateModel(this.inputSource, params.frame);
    }

    prepareResources(loader: Loader<any>) {
        if (this.currentXRControllerView.getStatus() !== XRViewStatus.READY) this.currentXRControllerView.prepareResources(loader);
    }

    protected goToVR() {
        super.goToVR();
    }

    protected goFromVR() {
        super.goFromVR();
    }

    protected setInputSources(inputSources) {
        super.setInputSources(inputSources);
        this.controllerModel.mainContainer.visible = true;
        inputSources.forEach((el) => {
            if (el.handedness === 'right') this.inputSource = el;
        });
    }

    protected resetInputSources() {
        super.resetInputSources();
        this.controllerModel.mainContainer.visible = false;
        this.inputSource = null;
    }
}