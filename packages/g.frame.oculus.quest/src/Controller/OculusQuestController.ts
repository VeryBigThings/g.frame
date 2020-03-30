import { EventDispatcher } from '@verybigthings/g.frame.core';
import { OculusQuestModel } from '../Model/OculusQuestModel';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';

export class OculusQuestController extends EventDispatcher<string> {
    private renderer: any;
    private inputSourceLeft: any;
    private inputSourceRight: any;

    constructor(private data: any, private oculusQuestModel: OculusQuestModel) {
        super();
        this.oculusQuestModel = oculusQuestModel;
        this.renderer = this.data.viewer.renderer;

        // @ts-ignore
        if ('xr' in navigator && 'isSessionSupported' in navigator.xr) {
            const button = VRButton.createButton(this.renderer, { referenceSpaceType: 'local' });
            document.body.appendChild(button);

            this.renderer.xr.addEventListener('sessionstart', (event) => {
                this.fire('goToVR');
            });
            this.renderer.xr.addEventListener('sessionend', (event) => {
                this.fire('goFromVR');
            });

            this.on('goToVR', () => {
                const session = this.renderer.xr.getSession();
                session.addEventListener('inputsourceschange', () => {
                    session.inputSources.length ? this.setInputSources(session.inputSources) : this.resetInputSources();
                });
            });
            this.on('goFromVR', () => {
                this.resetInputSources();
            });
        }
    }

    initView() {
        this.oculusQuestModel.initView();
    }

    update(params: { currentTime: number; frame: any }) {
        this.oculusQuestModel.updateInstance(this.inputSourceLeft, this.inputSourceRight, params.frame);
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