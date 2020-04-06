import { XRManager } from '@verybigthings/g.frame.common.xr_manager';
import {WebGLRenderer} from 'three';
import {OculusQuestModel} from './OculusQuestModel';

export const CONTROLLER_HANDEDNESS_CODE = {
    LEFT: 0,
    RIGHT: 1,
};

export class InputSourceManager extends XRManager {
    private inputSourceLeft: any;
    private inputSourceRight: any;

    constructor(renderer: WebGLRenderer, private oculusQuestModel: OculusQuestModel) {
        super(renderer);

        this.createButton();
        this.initEvents();
    }

    manipulateModel(params: { currentTime: number; frame: any }) {
        this.oculusQuestModel.manipulateModel(this.inputSourceLeft, this.inputSourceRight, params.frame);
    }

    protected goToVR() {
        super.goToVR();
        const session = this.renderer.xr.getSession();
        session.addEventListener('inputsourceschange', () => {
            if (session.inputSources.length)
                this.setInputSources(session.inputSources);
            else
                this.resetInputSources();
        });
    }

    protected goFromVR() {
        super.goFromVR();
        this.resetInputSources();
    }

    private setInputSources(inputSources) {
        this.oculusQuestModel.mainContainer.visible = true;
        inputSources.forEach((el) => {
            if (el.handedness === 'left') this.inputSourceLeft = el;
            if (el.handedness === 'right') this.inputSourceRight = el;
        });
    }

    private resetInputSources() {
        this.oculusQuestModel.mainContainer.visible = false;
        this.inputSourceLeft = null;
        this.inputSourceRight = null;
    }
}