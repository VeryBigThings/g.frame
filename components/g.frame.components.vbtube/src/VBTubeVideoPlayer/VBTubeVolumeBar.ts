import {
    BAR_CIRCLE_SEGMENTS_NUMBER,
    VOLUME_BAR_CIRCLE_RADIUS,
    VOLUME_BAR_COLOR,
    VOLUME_BAR_HEIGHT,
    VOLUME_BAR_WIDTH
} from './constants';
import {CircleGeometry, MeshBasicMaterial, PlaneGeometry} from 'three';
import {
    ActionController,
    ActionControllerEvent,
    ActionControllerEventName
} from '@g.frame/common.action_controller';
import {GMesh, GframeModule} from '@g.frame/core';

/**
 * Class to manipulate volume bar
 */
export class VBTubeVolumeBar extends GframeModule {
    private grayBar: GMesh<PlaneGeometry, MeshBasicMaterial>;
    private whiteBar: GMesh<PlaneGeometry, MeshBasicMaterial>;
    private whiteCircle: GMesh<CircleGeometry, MeshBasicMaterial>;

    /**
     * Constructor of the class. Adds volume bar to the scene
     * @param videoParameters Standard param to set optimal size for volume bar
     */
    constructor(private videoParameters: any, private actionController: ActionController) {
        super();

        // Volume bar items
        this.grayBar = new GMesh(
            new PlaneGeometry(this.videoParameters.width / VOLUME_BAR_WIDTH,
                this.videoParameters.height / VOLUME_BAR_HEIGHT),
            new MeshBasicMaterial({color: VOLUME_BAR_COLOR})
        );
        this.grayBar.position.set(0, 0, this.videoParameters.layer * 2);
        this.whiteBar = new GMesh(
            new PlaneGeometry(this.videoParameters.width / VOLUME_BAR_WIDTH - this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS,
                this.videoParameters.height / VOLUME_BAR_HEIGHT),
            new MeshBasicMaterial()
        );
        this.whiteBar.position.set(this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / -2, 0, this.videoParameters.layer * 1);
        this.whiteCircle = new GMesh(
            new CircleGeometry(this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS, BAR_CIRCLE_SEGMENTS_NUMBER),
            new MeshBasicMaterial()
        );
        this.whiteCircle.position.set(this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / -2 + this.videoParameters.width / VOLUME_BAR_WIDTH / 2 - this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / 2, 0, this.videoParameters.layer * 1);
        this.grayBar.name = 'graybar';

        this.addObject(this.whiteBar, null, this.grayBar);
        this.addObject(this.whiteCircle, null, this.grayBar);
        this.addObject(this.grayBar);

        // Button down action
        this.actionController.on(ActionControllerEventName.buttonDown, this.grayBar, (event: ActionControllerEvent) => {
            this.fire('volumebarButtonDown', event);
        });

        // UiObject name
        this.uiObject.name = 'volumeBar';
    }

    updateVolumeBar(muted: boolean, volume?: number) {
        if (!muted && volume === 1) {
            this.whiteBar.scale.set(1, 1, 1);
            this.whiteBar.position.x = this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / -2;
            this.whiteCircle.position.x = this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / -2 + this.videoParameters.width / VOLUME_BAR_WIDTH / 2 - this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / 2;
        } else if (!muted && volume !== 1) {
            this.whiteBar.scale.set(volume, 1, 1);
            this.whiteBar.position.x = -this.videoParameters.width / VOLUME_BAR_WIDTH / 2 + (this.videoParameters.width / VOLUME_BAR_WIDTH - this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS) * volume / 2;
            this.whiteCircle.position.x = -this.videoParameters.width / VOLUME_BAR_WIDTH / 2 + (this.videoParameters.width / VOLUME_BAR_WIDTH) * volume;
        } else if (muted) {
            this.whiteBar.scale.set(.1, 1, 1);
            this.whiteBar.position.x = this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / -2 - this.videoParameters.width / VOLUME_BAR_WIDTH / 2 + this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS;
            this.whiteCircle.position.x = this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / -2 - this.videoParameters.width / VOLUME_BAR_WIDTH / 2 + this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS / 2 + this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS;
        }
    }
}