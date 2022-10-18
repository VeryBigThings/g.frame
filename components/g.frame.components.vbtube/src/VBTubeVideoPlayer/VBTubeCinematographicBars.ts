import {BACKGROUND_BLACK_COLOR, BOTTOM_SPACE, CINEMATOGRAPHIC_BAR} from './constants';
import {MeshBasicMaterial, PlaneGeometry} from 'three';
import {GMesh, GframeModule, Tween} from '@g.frame/core';

/**
 * Class to add black top and bottom cinematographic lines
 */
export class VBTubeCinematographicBars extends GframeModule {
    private topLine: GMesh<PlaneGeometry, MeshBasicMaterial>;
    private bottomLine: GMesh<PlaneGeometry, MeshBasicMaterial>;

    constructor(private videoParameters: any) {
        super();

        // Top line
        this.topLine = new GMesh<PlaneGeometry, MeshBasicMaterial>(
            new PlaneGeometry(this.videoParameters.width, this.videoParameters.height / CINEMATOGRAPHIC_BAR),
            new MeshBasicMaterial({color: BACKGROUND_BLACK_COLOR})
        );
        this.topLine.position.set(0, this.videoParameters.height / 2 - this.videoParameters.height / BOTTOM_SPACE, this.videoParameters.layer * 1);
        this.topLine.rotateZ(Math.PI);
        this.addObject(this.topLine);

        // Bottom line
        this.bottomLine = new GMesh<PlaneGeometry, MeshBasicMaterial>(
            new PlaneGeometry(this.videoParameters.width, this.videoParameters.height / CINEMATOGRAPHIC_BAR),
            new MeshBasicMaterial({color: BACKGROUND_BLACK_COLOR})
        );
        this.bottomLine.position.set(0, this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_SPACE, this.videoParameters.layer * 1);
        this.addObject(this.bottomLine);

        // UiObject name
        this.uiObject.name = 'cinematographic bars';
    }

    hide(hide: boolean) {
        if (hide) {
            this.topLine.material.visible = false;
            this.bottomLine.material.visible = false;
        } else {
            this.topLine.material.visible = true;
            this.bottomLine.material.visible = true;
        }
    }
}