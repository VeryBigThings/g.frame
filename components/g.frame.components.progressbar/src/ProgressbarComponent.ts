import {WindowComponent} from '@g.frame/components.window';
import {Box3, Mesh, Vector3} from 'three';
import {RoundedPlane} from '@g.frame/core';
import {IProgressbarComponentOptions} from './ProgressbarComponent_interfaces';


export class ProgressbarComponent extends WindowComponent {
    protected options: IProgressbarComponentOptions;
    private uiObjectLoaded: Mesh;

    constructor(options: IProgressbarComponentOptions) {
        super(options);
    }

    private _progress: number;

    get progress(): number {
        return this._progress;
    }

    set progress(newProgress: number) {
        newProgress = (newProgress !== 0) ? newProgress : 0.02;

        if (this._progress === newProgress) return;

        this._progress = newProgress;

        if (this.uiObjectLoaded) {
            this.disposeObject(this.uiObjectLoaded);
        }

        const roundedPlaneOptions = {
            width: this.options.size.x * this._progress - this.options.margin * 2,
            height: this.options.size.y - this.options.margin * 2,
            color: this.options.backgroundLoaded,
            r1: this.options.bordRadius !== undefined ? this.options.bordRadius : (this.options.size.y - this.options.margin * 2) / 2,
            radiusPriority: true,
        };

        this.uiObjectLoaded = RoundedPlane.getRoundedPlane(roundedPlaneOptions);

        const b3 = new Box3();
        b3.setFromObject(this.uiObjectLoaded);

        this.uiObjectLoaded.position.x = -this.options.size.x / 2 + b3.getSize(new Vector3()).x / 2 + this.options.margin;
        this.uiObjectLoaded.position.y = -this.options.size.y / 2 + b3.getSize(new Vector3()).y / 2 + this.options.margin;
        this.uiObjectLoaded.position.z += this.options.spaceBetweenObjects !== undefined ? this.options.spaceBetweenObjects : 0.01;
        this.addObject(this.uiObjectLoaded);
    }
}
