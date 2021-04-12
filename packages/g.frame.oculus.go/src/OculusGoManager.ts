import { XRManager, XRViewStatus } from 'g.frame.common.xr_manager';
import { Loader } from 'g.frame.common.loaders';
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

    /**
     * Sends current input source info to the model
     * @param params Current parameters
     */
    manipulateModel(params: { currentTime: number; frame: any }) {
        this.controllerModel.manipulateModel(this.inputSource, params.frame);
    }

    /**
     * Checks and load all resources for current xr view
     * @param loader Current loader
     */
    prepareResources(loader: Loader<any>) {
        if (this.currentXRControllerView.getStatus() !== XRViewStatus.READY) this.currentXRControllerView.prepareResources(loader);
    }

    protected goToVR() {
        super.goToVR();
    }

    protected goFromVR() {
        super.goFromVR();
    }

    /**
     * Updates input source on each frame
     * @param inputSources Array with input source
     */
    protected setInputSources(inputSources) {
        super.setInputSources(inputSources);
        this.controllerModel.mainContainer.visible = true;
        inputSources.forEach((el) => {
            if (el.handedness === 'right') this.inputSource = el;
        });
    }

    /**
     * Nullifies current input source
     */
    protected resetInputSources() {
        super.resetInputSources();
        this.controllerModel.mainContainer.visible = false;
        this.inputSource = null;
    }
}