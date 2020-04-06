import { XRManager } from '@verybigthings/g.frame.common.xr_manager';
import { WebGLRenderer } from 'three';
import { OculusGoModel } from './OculusGoModel';

export class InputSourceController extends XRManager {
    private inputSource: any;

    constructor(renderer: WebGLRenderer, private oculusGoModel: OculusGoModel) {
        super(renderer);

        this.createButton();
        this.initEvents();
    }

    manipulateModel(params: { currentTime: number; frame: any }) {
        this.oculusGoModel.manipulateModel(this.inputSource, params.frame);
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
        this.oculusGoModel.mainContainer.visible = true;
        inputSources.forEach((el) => {
            if (el.handedness === 'right') this.inputSource = el;
        });
    }

    private resetInputSources() {
        this.oculusGoModel.mainContainer.visible = false;
        this.inputSource = null;
    }
}