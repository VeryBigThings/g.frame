import {MeshBasicMaterial, PlaneBufferGeometry, Vector2, Vector3} from 'three';
import {
    AVERAGE_VOLUME,
    BACKGROUND_TRANSPARENT,
    BOTTOM_BUTTON_SPACE,
    BUTTON_SIZE,
    CLICKABLE_PART_CENTER,
    FINISH_BIG_PLAY_PAUSE_BUTTON_SCALE,
    HIGH_VOLUME,
    SPACE_BETWEEN_BUTTONS,
    START_BIG_PLAY_PAUSE_BUTTON_SCALE,
    UI_BASIC_COLOR,
    VIDEO_CLICKABLE_PART
} from './constants';
import {GMesh, ViewerModule} from '@verybigthings/g.frame.core';
import {ITextComponentOptions, TextComponent} from '@verybigthings/g.frame.components.text';
import {ActionController, ActionControllerEventName} from '@verybigthings/g.frame.common.action_controller';
import { VBTubeVideoParameters } from './VBTubeVideoPlayer';

export interface IDisableButtons {
    subtitlesButton?: boolean;
    lightButton?: boolean;
    zoomButton?: boolean;
}

/**
 * Class to contain buttons
 */
export class VBTubeButtons extends ViewerModule {
    public playPauseButton: TextComponent;
    public skipButton: TextComponent;
    public soundButton: TextComponent;
    public lightButton: TextComponent;
    public subtitlesButton: TextComponent;
    public zoomButton: TextComponent;
    public screenClick: GMesh<PlaneBufferGeometry, MeshBasicMaterial>;
    public screenClickButtonIcon: TextComponent;
    private disabledButtons: IDisableButtons;

    /**
     * Adds buttons to the video player
     * @param videoParameters Scales of the video player
     * @param disableButtons IDisableButtons
     * @param actionController ActionController
     */
    constructor(private videoParameters: VBTubeVideoParameters, disableButtons: IDisableButtons = {
        subtitlesButton: false,
        lightButton: false,
        zoomButton: false
    }, private actionController: ActionController) {
        super();

        this.disabledButtons = disableButtons;

        // Custom position logic
        let subtitlesTransition = 3;
        let lightTransition = 2;

        if (this.disabledButtons.zoomButton || this.disabledButtons.lightButton) {
            subtitlesTransition--;
            lightTransition--;
        }
        if (this.disabledButtons.zoomButton && this.disabledButtons.lightButton) subtitlesTransition--;

        const subtitlesPosition = this.videoParameters.width / 2 - this.videoParameters.width / SPACE_BETWEEN_BUTTONS * subtitlesTransition;
        const lightPosition = this.videoParameters.width / 2 - this.videoParameters.width / SPACE_BETWEEN_BUTTONS * lightTransition;
        const zoomPosition = this.videoParameters.width / 2 - this.videoParameters.width / SPACE_BETWEEN_BUTTONS;

        // Buttons
        const buttonsTextOptions: ITextComponentOptions = {
            size: new Vector2(this.videoParameters.height / BUTTON_SIZE, this.videoParameters.height / BUTTON_SIZE),
            pxSize: new Vector2(64, 64),
            text: {
                style: {family: 'FontAwesome', weight: '900', color: UI_BASIC_COLOR.getStyle()},
                value: '6',
                autoWrappingHorizontal: true,
                margin: {bottom: 18}
            },
            background: {
                color: BACKGROUND_TRANSPARENT
            }
        };
        [
            {
                name: 'playPauseButton',
                position: new Vector3(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS,
                    this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_BUTTON_SPACE, this.videoParameters.layer * 2
                ),
            },
            {
                name: 'skipButton',
                position: new Vector3(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS * 2,
                    this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_BUTTON_SPACE, this.videoParameters.layer * 2
                ),
            },
            {
                name: 'soundButton',
                position: new Vector3(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS * 3,
                    this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_BUTTON_SPACE, this.videoParameters.layer * 2
                ),
            },
            {
                name: 'subtitlesButton',
                position: new Vector3(subtitlesPosition,
                    this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_BUTTON_SPACE, this.videoParameters.layer * 2
                ),
            },
            {
                name: 'lightButton',
                position: new Vector3(lightPosition,
                    this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_BUTTON_SPACE, this.videoParameters.layer * 2
                ),
            },
            {
                name: 'zoomButton',
                position: new Vector3(zoomPosition,
                    this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_BUTTON_SPACE, this.videoParameters.layer * 2
                ),
            },
        ].map(options => {
            if (options.name === 'zoomButton' && this.disabledButtons[options.name]) return;
            if (options.name === 'lightButton' && this.disabledButtons[options.name]) return;
            if (options.name === 'subtitlesButton' && this.disabledButtons[options.name]) return;
            this[options.name] = new TextComponent(buttonsTextOptions);
            this[options.name].uiObject.name = options.name;
            this[options.name].uiObject.position.copy(options.position);
            this[options.name].uiObject.userData.active = true;
            return this.addObject(this[options.name]);
        });

        // Button events
        // Play/Pause button
        this.actionController.on(ActionControllerEventName.click, this.playPauseButton.uiObject, () => {
            this.fire('playButtonClicked');
        });

        // Skip button
        this.actionController.on(ActionControllerEventName.click, this.skipButton.uiObject, () => {
            this.fire('skipButtonClicked');
        });

        // Sound button
        this.actionController.on(ActionControllerEventName.click, this.soundButton.uiObject, () => {
            this.fire('soundButtonClicked');
        });
        this.actionController.on(ActionControllerEventName.over, this.soundButton.uiObject, () => {
            this.fire('soundButtonOver');
        });
        this.actionController.on(ActionControllerEventName.out, this.soundButton.uiObject, () => {
        });

        // Subtitles button
        if (this.subtitlesButton) this.actionController.on(ActionControllerEventName.click, this.subtitlesButton.uiObject, () => {
            this.fire('subtitlesButtonClicked');
        });

        // Light button
        if (this.lightButton) {
            this.lightButton.uiObject.userData.on = true;
            this.actionController.on(ActionControllerEventName.click, this.lightButton.uiObject, () => {
                this.fire('lightButtonClicked');
            });
        }

        // Zoom button
        if (this.zoomButton) {
            this.zoomButton.uiObject.userData.expanded = false;
            this.actionController.on(ActionControllerEventName.click, this.zoomButton.uiObject, () => {
                this.fire('zoomButtonClicked');
            });
        }

        // Screen clickable
        this.screenClick = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
            new PlaneBufferGeometry(this.videoParameters.width, this.videoParameters.height * VIDEO_CLICKABLE_PART),
            new MeshBasicMaterial({visible: false})
        );
        this.screenClick.translateY(this.videoParameters.height * CLICKABLE_PART_CENTER);
        this.addObject(this.screenClick);

        // Screen clickable icon
        this.screenClickButtonIcon = new TextComponent({
            size: new Vector2(this.videoParameters.height, this.videoParameters.height),
            pxSize: new Vector2(128, 128),
            text: {
                style: {family: 'FontAwesome', weight: '900', color: UI_BASIC_COLOR.getStyle()},
                value: '',
                autoWrappingHorizontal: true,
                margin: {bottom: 18}
            },
            background: {
                color: BACKGROUND_TRANSPARENT
            }
        });
        this.screenClickButtonIcon.uiObject.position.z = this.videoParameters.layer * 1;
        this.screenClickButtonIcon.uiObject.visible = false;
        this.addObject(this.screenClickButtonIcon);

        // Video screen
        this.actionController.on(ActionControllerEventName.click, this.screenClick, () => {
            this.fire('screenClicked');
        });

        this.uiObject.name = 'buttons';
    }

    /**
     * Sets icons to the corresponding buttons
     */
    init() {
        if (this.playPauseButton) this.playPauseButton.setText('');
        if (this.screenClickButtonIcon) this.screenClickButtonIcon.setText('');
        if (this.skipButton) this.skipButton.setText('');
        if (this.soundButton) this.soundButton.setText('');
        if (this.subtitlesButton) this.subtitlesButton.setText('');
        if (this.lightButton) this.lightButton.setText('');
        if (this.zoomButton) this.zoomButton.setText('');
    }

    /**
     * Sets uiObject visible parameter to all buttons
     * @param remove visible parameter
     */
    remove(remove: boolean) {
        if (remove) {
            [this.playPauseButton, this.skipButton, this.soundButton, this.subtitlesButton, this.lightButton, this.zoomButton].forEach(el => {
                if (el) el.uiObject.visible = false;
            });
        } else {
            [this.playPauseButton, this.skipButton, this.soundButton, this.subtitlesButton, this.lightButton, this.zoomButton].forEach(el => {
                if (el && el.uiObject.userData.active) el.uiObject.visible = true;
            });
        }
    }

    /**
     * Updates button's icons
     * @param button Button to update
     * @param on Condition of the button
     */
    setText(button: string, on: boolean) {
        switch (button) {
            case 'replay': {
                if (on) {
                    if (this.playPauseButton) this.playPauseButton.setText('');
                }
                break;
            }

            case 'sound': {
                if (on) {
                    if (this.soundButton) this.soundButton.setText('');
                } else {
                    if (this.soundButton) this.soundButton.setText('');
                }
                break;
            }

            case 'light': {
                if (on) {
                    if (this.lightButton) this.lightButton.setText('');
                } else {
                    if (this.lightButton) this.lightButton.setText('');
                }
                break;
            }

            case 'expand': {
                if (on) {
                    if (this.zoomButton) this.zoomButton.setText('');
                } else {
                    if (this.zoomButton) this.zoomButton.setText('');
                }
                break;
            }

            case 'play': {
                if (on) {
                    if (this.playPauseButton) this.playPauseButton.setText('');
                    if (this.screenClickButtonIcon) this.screenClickButtonIcon.setText('');
                } else {
                    if (this.playPauseButton) this.playPauseButton.setText('');
                    if (this.screenClickButtonIcon) this.screenClickButtonIcon.setText('');
                }
                break;
            }

            default: {
                console.error('Error: Button does not exist');
                break;
            }
        }
    }

    /**
     * Updates volume icon on each frame
     */
    setCurrentVolumeIcon(muted: boolean, volume: number) {
        if (muted) {
            if (this.soundButton) this.soundButton.setText('');
        } else if (volume < AVERAGE_VOLUME) {
            if (this.soundButton) this.soundButton.setText('');
        } else if (volume < HIGH_VOLUME) {
            if (this.soundButton) this.soundButton.setText('');
        } else {
            if (this.soundButton) this.soundButton.setText('');
        }
    }

    /**
     * Provides animation of clicking on the screen area
     */
    animateScreenClickButton() {
        this.screenClickButtonIcon.uiObject.scale.set(START_BIG_PLAY_PAUSE_BUTTON_SCALE, START_BIG_PLAY_PAUSE_BUTTON_SCALE, START_BIG_PLAY_PAUSE_BUTTON_SCALE);
        const scale = this.screenClickButtonIcon.uiObject.scale.clone();
        scale.set(FINISH_BIG_PLAY_PAUSE_BUTTON_SCALE, FINISH_BIG_PLAY_PAUSE_BUTTON_SCALE, FINISH_BIG_PLAY_PAUSE_BUTTON_SCALE);
        new TWEEN.Tween(this.screenClickButtonIcon.uiObject.scale)
            .easing(TWEEN.Easing.Linear.None)
            .to(scale, 375)
            .onStart(() => {
                this.screenClickButtonIcon.uiObject.visible = true;
            })
            .onUpdate((alpha: any) => {
                this.screenClickButtonIcon.material.opacity = 1 - alpha;
            })
            .onComplete(() => {
                this.screenClickButtonIcon.uiObject.visible = false;
            })
            .start();
    }
}