import { Vector2, CircleBufferGeometry, MeshBasicMaterial, PlaneBufferGeometry } from 'three';
import {
    PROGRESS_BAR_CIRCLE_RADIUS, PROGRESS_BAR_CIRCLE_POSITION,
    PROGRESS_BAR_HEIGHT, PROGRESS_BAR_OVER_COLOR, PROGRESS_BAR_BUFFER_COLOR, BAR_CIRCLE_SEGMENTS_NUMBER,
    PROGRESS_BAR_WIDTH, PROGRESS_BAR_BACKGROUND_COLOR,
    PROGRESS_BAR_BACKGROUND_LOADED_COLOR, PROGRESS_BAR_SCALE, MINIMAL_SCALE, BOTTOM_SPACE
} from './constants';
import {GComponent} from '@verybigthings/g.frame.core';
import { ProgressbarComponent } from '@verybigthings/g.frame.components.progressbar';
import { GMesh } from '@verybigthings/g.frame.core';
import {
    ActionController,
    ActionControllerEvent,
    ActionControllerEventName
} from '@verybigthings/g.frame.common.action_controller';

/**
 * Class to manipulate progress bar
 */
export class VBTubeProgressbar extends GComponent {
    public progressbar: ProgressbarComponent;
    private redCircle: GMesh<CircleBufferGeometry, MeshBasicMaterial>;
    private grayMoveProgressbar: GMesh<PlaneBufferGeometry, MeshBasicMaterial>;
    private whiteVideoProgressbar: GMesh<PlaneBufferGeometry, MeshBasicMaterial>;
    private progressbarWidth: number;
    private progressbarHeight: number;
    private tweenReady: boolean;

    /**
     * Constructor of the class. Adds progress bar to the scene
     * @param videoParameters Standard param to set optimal size for progress bar
     * @param actionController ActionController
     */
    constructor(private videoParameters: any, private actionController: ActionController) {
        super();

        // Progress bar
        this.tweenReady = true;
        this.progressbarWidth = this.videoParameters.width - this.videoParameters.width / PROGRESS_BAR_WIDTH;
        this.progressbarHeight = this.videoParameters.height / PROGRESS_BAR_HEIGHT;
        this.progressbar = new ProgressbarComponent({
            size: new Vector2(this.progressbarWidth, this.progressbarHeight),
            spaceBetweenObjects: this.videoParameters.layer * 3,
            backgroundLoaded: PROGRESS_BAR_BACKGROUND_LOADED_COLOR.getHex(),
            background: PROGRESS_BAR_BACKGROUND_COLOR.getHex(),
            bordRadius: 0,
            bordWidth: 0,
            margin: 0,
        });
        this.progressbar.uiObject.position.set(0, this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_SPACE * 2.35, this.videoParameters.layer * 1);
        this.addObject(this.progressbar);

        // Progress bar items
        this.redCircle = new GMesh<CircleBufferGeometry, MeshBasicMaterial>(
                            new CircleBufferGeometry(this.videoParameters.height / PROGRESS_BAR_CIRCLE_RADIUS, BAR_CIRCLE_SEGMENTS_NUMBER),
                            new MeshBasicMaterial({color: 'red'})
                        );
        this.redCircle.position.set(this.videoParameters.width / -2 + this.videoParameters.width / PROGRESS_BAR_CIRCLE_POSITION, 0, this.videoParameters.layer * 3);
        this.redCircle.visible = false;
        this.grayMoveProgressbar = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
                            new PlaneBufferGeometry(this.videoParameters.width - this.videoParameters.width / PROGRESS_BAR_WIDTH,
                                this.videoParameters.height / PROGRESS_BAR_HEIGHT),
                            new MeshBasicMaterial({color: PROGRESS_BAR_OVER_COLOR})
                        );
        this.grayMoveProgressbar.position.set(0, 0, this.videoParameters.layer * 1);
        this.grayMoveProgressbar.visible = false;
        this.whiteVideoProgressbar = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
                            new PlaneBufferGeometry(this.videoParameters.width - this.videoParameters.width / PROGRESS_BAR_WIDTH,
                                this.videoParameters.height / PROGRESS_BAR_HEIGHT),
                            new MeshBasicMaterial({color: PROGRESS_BAR_BUFFER_COLOR})
                        );
        this.whiteVideoProgressbar.position.set(0, 0, this.videoParameters.layer * 2);
        this.whiteVideoProgressbar.visible = false;
        this.addObject(this.whiteVideoProgressbar, null, this.progressbar.uiObject);
        this.addObject(this.grayMoveProgressbar, null, this.progressbar.uiObject);
        this.addObject(this.redCircle, null, this.progressbar.uiObject);

        // Click Event
        this.actionController.on(ActionControllerEventName.click, this.progressbar.uiObject.children[0], (event: ActionControllerEvent) => {
            this.fire('progressbarClicked', event);
        });

        // Move Event
        this.actionController.on(ActionControllerEventName.move, this.progressbar.uiObject.children[0], (event: ActionControllerEvent) => {
            this.grayMoveProgressbar.scale.set(event.data.intersection.uv.x, 1, 1);
            this.grayMoveProgressbar.position.x = event.data.intersection.uv.x * this.progressbarWidth - this.progressbarWidth / 2 * event.data.intersection.uv.x - this.progressbarWidth / 2;
        });

        // Over/out Events
        this.actionController.on(ActionControllerEventName.over, this.progressbar.uiObject, () => {
            this.uiObject.userData.isOver = true;
            this.show(true);
        });
        this.actionController.on(ActionControllerEventName.out, this.progressbar.uiObject, () => {
            this.uiObject.userData.isOver = false;
            this.show(false);
        });

        // Button up/down Events
        this.actionController.on(ActionControllerEventName.buttonDown, this.progressbar.uiObject.children[0], (event: ActionControllerEvent) => {
            this.grayMoveProgressbar.visible = false;
            this.fire('progressbarButtonDown', event);
        });
        this.actionController.on(ActionControllerEventName.buttonUp, this.progressbar.uiObject.children[0], () => {
            this.grayMoveProgressbar.visible = true;
        });

        // UiObject name
        this.uiObject.name = 'progress bar';
    }

    hideBufferLine() {
        this.whiteVideoProgressbar.visible = false;
    }

    show(show: boolean) {
        if (show) {
            if (!this.uiObject.userData.pushed && this.tweenReady) {
                this.animateProgressbar('show');
            }
        } else {
            if (!this.uiObject.userData.pushed && this.tweenReady) {
                this.animateProgressbar('hide');
            }
        }
    }

    updateProgressbar(currentTime: number, duration: number, buffered: any) {
        this.progressbar.progress = currentTime / duration || 0.0001;

        // Update red circle
        this.redCircle.position.x = (currentTime / duration * this.progressbarWidth) - this.progressbarWidth / 2;

        // Update buffer line
        for (let i = 0; i < buffered.length; i++) {
            if (buffered.start(buffered.length - 1 - i) < currentTime) {
                this.whiteVideoProgressbar.visible = true;
                const x = buffered.end(buffered.length - 1 - i) / duration;
                this.whiteVideoProgressbar.scale.set(x, 1, 1);
                this.whiteVideoProgressbar.position.x = (x * this.progressbarWidth - this.progressbarWidth) / 2;
                break;
            }
        }
    }

    private animateProgressbar(direction: 'show'|'hide') {
        const circleScale = this.redCircle.scale.clone();
        const barScale = this.progressbar.uiObject.scale.clone();

        if (direction === 'show') {
            circleScale.set(PROGRESS_BAR_SCALE, 1, PROGRESS_BAR_SCALE);
            barScale.set(1, PROGRESS_BAR_SCALE, 1);
        } else if (direction === 'hide') {
            circleScale.set(MINIMAL_SCALE, MINIMAL_SCALE, MINIMAL_SCALE);
            barScale.set(1, 1, 1);
        }

        new TWEEN.Tween(this.progressbar.uiObject.scale)
            .to(barScale, 150)
            .start();
        new TWEEN.Tween(this.redCircle.scale)
            .to(circleScale, 150)
            .onStart(() => {
                this.tweenReady = true;
                if (direction === 'show') {
                    this.redCircle.visible = true;
                    this.grayMoveProgressbar.visible = true;
                } else if (direction === 'hide') {
                    this.grayMoveProgressbar.visible = false;
                }
            })
            .onComplete(() => {
                this.tweenReady = true;
                if (direction === 'hide') {
                    this.redCircle.visible = false;
                }
            })
            .start();
    }
}