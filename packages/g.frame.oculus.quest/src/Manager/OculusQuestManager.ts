import {EventDispatcher} from '@verybigthings/g.frame.core';
import {VRButton} from 'three/examples/jsm/webxr/VRButton';
import {WebGLRenderer} from 'three';
import {OculusQuestModel} from '../Model/OculusQuestModel';

export enum XREvent {
    goToVR = 'goToVR',
    goFromVR = 'goFromVR'
}

export class XRManager extends EventDispatcher<XREvent> {

    constructor(protected readonly renderer: WebGLRenderer) {super(); }

    protected initEvents() {
        // @ts-ignore
        this.renderer.xr.addEventListener('sessionstart', (event) => {
            this.goToVR();
            this.fire(XREvent.goToVR);
        });
        // @ts-ignore
        this.renderer.xr.addEventListener('sessionend', (event) => {
            this.goFromVR();
            this.fire(XREvent.goFromVR);
        });
    }

    protected createButton() {
        const button = VRButton.createButton(this.renderer, {referenceSpaceType: 'local'});
        document.body.appendChild(button);
    }


    protected goToVR() {}

    protected goFromVR() {}
}


export class OculusQuestManager extends XRManager {
    private inputSourceLeft: any;
    private inputSourceRight: any;

    constructor(renderer: WebGLRenderer, private oculusQuestModel: OculusQuestModel) {
        super(renderer);
        this.oculusQuestModel = oculusQuestModel;

        this.createButton();
        this.initEvents();
    }

    update(params: { currentTime: number; frame: any }) {
        this.oculusQuestModel.updateInstance(this.inputSourceLeft, this.inputSourceRight, params.frame);
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
        this.oculusQuestModel.uiObject.visible = true;
        inputSources.forEach((el) => {
            if (el.handedness === 'left') this.inputSourceLeft = el;
            if (el.handedness === 'right') this.inputSourceRight = el;
        });
    }

    private resetInputSources() {
        this.oculusQuestModel.uiObject.visible = false;
        this.inputSourceLeft = null;
        this.inputSourceRight = null;
    }
}