import {EventDispatcher} from '@verybigthings/g.frame.core';
import {VRButton} from 'three/examples/jsm/webxr/VRButton';
import {WebGLRenderer} from 'three';
import {IXRControllerModel, IXRControllerView} from './interfaces';

export enum XREvent {
    goToVR = 'goToVR',
    goFromVR = 'goFromVR'
}

export type XRInputSource = any;

export class XRManager extends EventDispatcher<XREvent> {
    public __agentConstructor: Function;
    protected defaultXRControllerView: IXRControllerView;
    protected currentXRControllerView: IXRControllerView;
    protected controllerModel: IXRControllerModel;


    constructor(protected readonly renderer: WebGLRenderer) {
        super();
    }

    public getCurrentView(): IXRControllerView {
        return this.currentXRControllerView;
    }

    public getDefaultView(): IXRControllerView {
        return this.defaultXRControllerView;
    }

    public setXRControllerView(newXRControllerView?: IXRControllerView) {
        this.currentXRControllerView = newXRControllerView ?? this.defaultXRControllerView;
        this.controllerModel.updateView(this.currentXRControllerView);
    }

    protected initEvents() {
        // @ts-ignore
        this.renderer.xr.addEventListener('sessionstart', (event) => {
            this.processInputSources();
            this.goToVR();
            this.fire(XREvent.goToVR);
        });
        // @ts-ignore
        this.renderer.xr.addEventListener('sessionend', (event) => {
            this.resetInputSources();
            this.goFromVR();
            this.fire(XREvent.goFromVR);
        });
    }

    protected createButton() {
        const button = VRButton.createButton(this.renderer, {referenceSpaceType: 'local'});
        document.body.appendChild(button);
    }

    protected processInputSources() {
        const session = this.renderer.xr.getSession();
        session.addEventListener('inputsourceschange', () => {
            if (session.inputSources.length) {
                this.setInputSources(session.inputSources);
            } else {
                this.resetInputSources();
            }
        });
    }

    protected goToVR() {}

    protected goFromVR() {}

    protected setInputSources(inputSources: Array<XRInputSource>) {}

    protected resetInputSources() {}
}