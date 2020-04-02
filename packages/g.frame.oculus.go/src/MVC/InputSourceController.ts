import { EventDispatcher } from '@verybigthings/g.frame.core';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { WebGLRenderer } from 'three';
import { OculusGoModel } from './OculusGoModel';

export enum XREvent {
    goToVR = 'goToVR',
    goFromVR = 'goFromVR'
}

export class XRController extends EventDispatcher<XREvent> {

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


export class InputSourceController extends XRController {
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