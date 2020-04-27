import { EventDispatcher } from '@verybigthings/g.frame.core';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { WebGLRenderer } from 'three';
import { IXRControllerModel, IXRControllerView } from './interfaces';

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

    /**
     * Returns current XR view
     */
    public getCurrentView(): IXRControllerView {
        return this.currentXRControllerView;
    }

    /**
     * Returns default XR view
     */
    public getDefaultView(): IXRControllerView {
        return this.defaultXRControllerView;
    }

    /**
     * Replaces current XR view by another.
     * If the view doesn't exist, default view will be setted.
     * Each default view is different for every type of the device!
     */
    public setXRControllerView(newXRControllerView?: IXRControllerView) {
        this.currentXRControllerView = newXRControllerView ?? this.defaultXRControllerView;
        this.controllerModel.updateView(this.currentXRControllerView);
    }

    /**
     * Adds event listeners for tracking XR session
     */
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

    /**
     * Creates "Enter VR" button
     */
    protected createButton() {
        const button = VRButton.createButton(this.renderer, { referenceSpaceType: 'local' });
        document.body.appendChild(button);
    }

    /**
     * Adds event listener on input source changing
     */
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

    /**
     * Function to add some business logic when enter XR
     */
    protected goToVR() { }

    /**
     * Function to add some business logic when exit XR
     */
    protected goFromVR() { }

    /**
     * Function to update input sources when changed
     */
    protected setInputSources(inputSources: Array<XRInputSource>) { }

    /**
     * Function to nullify input sources when they don't exist
     */
    protected resetInputSources() { }
}