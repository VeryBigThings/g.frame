import {
    BACKGROUND_BLACK_COLOR,
    MINIMAL_SCALE,
    SUBTITLES_HEIGHT,
    SUBTITLES_POSITION,
    SUBTITLES_TRANSITION,
    SUBTITLES_UNDERLINE_HEIGHT,
    SUBTITLES_UNDERLINE_POSITION_X,
    SUBTITLES_UNDERLINE_POSITION_Y,
    SUBTITLES_UNDERLINE_WIDTH,
    SUBTITLES_WIDTH,
    UI_BASIC_COLOR
} from './constants';
import {Group, MeshBasicMaterial, PlaneBufferGeometry, Vector2} from 'three';
import {TextComponent} from '@verybigthings/g.frame.components.text';
import {GMesh, ViewerModule} from '@verybigthings/g.frame.core';
import {IDisableButtons} from './';

/**
 * Class to add subtitles
 */
export class VBTubeSubtitles extends ViewerModule {
    public subtitlesWrapper: Group;
    private subtitles: TextComponent;
    private redUnderline: GMesh<PlaneBufferGeometry, MeshBasicMaterial>;

    constructor(private videoParameters: any, disabledButtons: IDisableButtons = {
        subtitlesButton: false,
        lightButton: false,
        zoomButton: false
    }, subtitlesText) {
        super();

        // Subtitles
        const x = this.videoParameters.width - this.videoParameters.width / SUBTITLES_WIDTH;
        const y = this.videoParameters.height / SUBTITLES_HEIGHT;
        const subtitlesQuality = 128;
        this.subtitles = new TextComponent({
            size: new Vector2(x, y),
            pxSize: new Vector2(subtitlesQuality * x / y, subtitlesQuality),
            text: {
                style: {
                    family: 'Serif',
                    weight: '500',
                    color: UI_BASIC_COLOR.getStyle(),
                    size: `${subtitlesQuality / 3}px`
                },
                value: '',
                lineHeight: subtitlesQuality / 3,
                margin: {bottom: 18},
                autoWrappingHorizontal: false,
                autoWrapping: true,
                align: 'center',
            },
            background: {
                color: BACKGROUND_BLACK_COLOR.getStyle(),
            }
        });
        this.subtitles.uiObject.position.set(0, this.videoParameters.height / -2 + this.videoParameters.height / SUBTITLES_POSITION,
            this.videoParameters.layer * SUBTITLES_POSITION
        );
        this.subtitles.uiObject.visible = false;
        this.subtitlesWrapper = new Group();
        this.subtitlesWrapper.add(this.subtitles.uiObject);
        this.addObject(this.subtitlesWrapper);
        // this.addObject(this.subtitles);

        // Subtitles items
        let subtitlesTransition = 1;
        if (disabledButtons.zoomButton || disabledButtons.lightButton) {
            subtitlesTransition = 1.5;
        }
        if (disabledButtons.zoomButton && disabledButtons.lightButton) subtitlesTransition = 3;
        if (!disabledButtons.subtitlesButton && subtitlesText) {
            this.redUnderline = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
                new PlaneBufferGeometry(this.videoParameters.width / SUBTITLES_UNDERLINE_WIDTH, this.videoParameters.height / SUBTITLES_UNDERLINE_HEIGHT),
                new MeshBasicMaterial({color: 'red', transparent: true})
            );
            this.redUnderline.position.set(this.videoParameters.width / 2 - this.videoParameters.width / SUBTITLES_UNDERLINE_POSITION_X / subtitlesTransition,
                this.videoParameters.height / -2 + this.videoParameters.height / SUBTITLES_UNDERLINE_POSITION_Y, this.videoParameters.layer * 3
            );
            this.redUnderline.visible = false;
            this.redUnderline.scale.set(MINIMAL_SCALE, MINIMAL_SCALE, MINIMAL_SCALE);
            this.addObject(this.redUnderline);
        }

        // UiObject name
        this.uiObject.name = 'subtitles';
    }

    setText(subtitlesText: string) {
        this.subtitles.setText(subtitlesText);
    }

    show(show: boolean) {
        if (show) {
            if (this.subtitles.uiObject.userData.isVisible) {
                this.subtitles.uiObject.userData.isVisible = false;
                this.subtitles.uiObject.visible = false;
            } else if (!this.subtitles.uiObject.userData.isVisible) {
                this.subtitles.uiObject.userData.isVisible = true;
                this.subtitles.uiObject.visible = true;
            }
        } else {
            this.subtitles.uiObject.userData.isVisible = false;
            this.subtitles.uiObject.visible = false;
        }

        if (this.redUnderline) this.animateRedUnderline();
    }

    setTransition(alpha: number, up: boolean) {
        if (up) {
            this.subtitles.uiObject.position.y = this.videoParameters.height / -2 + this.videoParameters.height / SUBTITLES_POSITION - this.videoParameters.height / SUBTITLES_TRANSITION * alpha;
            if (this.redUnderline) this.redUnderline.material.opacity = 1 - alpha;
        } else {
            this.subtitles.uiObject.position.y = this.videoParameters.height / -2 + this.videoParameters.height / SUBTITLES_POSITION - this.videoParameters.height / SUBTITLES_TRANSITION + this.videoParameters.height / SUBTITLES_TRANSITION * alpha;
            if (this.redUnderline) this.redUnderline.material.opacity = alpha;
        }
    }

    private animateRedUnderline() {
        const scale = this.redUnderline.scale.clone();

        if (this.subtitles.uiObject.visible) {
            scale.set(1, 1, 1);
        } else {
            scale.set(MINIMAL_SCALE, MINIMAL_SCALE, MINIMAL_SCALE);
        }

        new TWEEN.Tween(this.redUnderline.scale)
            .to(scale, 100)
            .onStart(() => {
                if (this.subtitles.uiObject.visible) {
                    this.redUnderline.visible = true;
                }
            })
            .onComplete(() => {
                if (!this.subtitles.uiObject.visible) {
                    this.redUnderline.visible = false;
                }
            })
            .start();
    }
}