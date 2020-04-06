import { EventDispatcher } from '@verybigthings/g.frame.core';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { WebGLRenderer } from 'three';

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