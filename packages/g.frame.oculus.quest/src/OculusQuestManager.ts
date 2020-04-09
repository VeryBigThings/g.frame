import {XRInputSource, XRManager, XRViewStatus} from '@verybigthings/g.frame.common.xr_manager';
import {WebGLRenderer} from 'three';
import {OculusQuestModel} from './OculusQuestModel';
import {OculusQuestView} from './OculusQuestView';
import {Loader} from '@verybigthings/g.frame.common.loaders';


export class OculusQuestManager extends XRManager {
    protected currentXRControllerView: OculusQuestView;
    protected defaultXRControllerView: OculusQuestView;
    private inputSourceLeft: XRInputSource;
    private inputSourceRight: XRInputSource;

    constructor(renderer: WebGLRenderer, private oculusQuestModel: OculusQuestModel) {
        super(renderer);
        this.defaultXRControllerView = new OculusQuestView();

        this.createButton();
        this.initEvents();
    }

    manipulateModel(params: { currentTime: number; frame: any }) {
        this.oculusQuestModel.manipulateModel(this.inputSourceLeft, this.inputSourceRight, params.frame);
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

    protected setInputSources(inputSources: Array<XRInputSource>) {
        super.setInputSources(inputSources);
        this.oculusQuestModel.mainContainer.visible = true;
        inputSources.forEach((el) => {
            if (el.handedness === 'left') this.inputSourceLeft = el;
            if (el.handedness === 'right') this.inputSourceRight = el;
        });
    }

    protected resetInputSources() {
        super.resetInputSources();
        this.oculusQuestModel.mainContainer.visible = false;
        this.inputSourceLeft = null;
        this.inputSourceRight = null;
    }


}