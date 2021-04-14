import { XRInputSource, XRManager, XRViewStatus } from 'g.frame.common.xr_manager';
import { Loader } from 'g.frame.common.loaders';
import { WebGLRenderer } from 'three';
import { OculusQuestModel } from './OculusQuestModel';
import { OculusQuestView } from './OculusQuestView';


export class OculusQuestManager extends XRManager {
    protected currentXRControllerView: OculusQuestView;
    protected defaultXRControllerView: OculusQuestView;
    private inputSourceLeft: XRInputSource;
    private inputSourceRight: XRInputSource;

    constructor(renderer: WebGLRenderer, protected controllerModel: OculusQuestModel) {
        super(renderer);

        this.defaultXRControllerView = new OculusQuestView();
        this.currentXRControllerView = this.defaultXRControllerView;

        this.setXRControllerView(this.currentXRControllerView);
        this.createButton();
        this.initEvents();
    }

    /**
     * Sends current input sources info to the model
     * @param params Current parameters
     */
    manipulateModel(params: { currentTime: number; frame: any }) {
        this.controllerModel.manipulateModel(this.inputSourceLeft, this.inputSourceRight, params.frame);
    }

    /**
     * Checks and load all resources for current XR view
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
     * Updates input sources on each frame
     * @param inputSources Array with input sources
     */
    protected setInputSources(inputSources: Array<XRInputSource>) {
        super.setInputSources(inputSources);
        this.controllerModel.mainContainer.visible = true;
        inputSources.forEach((el) => {
            if (el.handedness === 'left') this.inputSourceLeft = el;
            if (el.handedness === 'right') this.inputSourceRight = el;
        });
    }

    /**
     * Nullifies current input sources
     */
    protected resetInputSources() {
        super.resetInputSources();
        this.controllerModel.mainContainer.visible = false;
        this.inputSourceLeft = null;
        this.inputSourceRight = null;
    }
}
