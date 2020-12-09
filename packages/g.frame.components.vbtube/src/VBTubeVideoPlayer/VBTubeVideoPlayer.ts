import {
    LinearFilter,
    Mesh,
    MeshBasicMaterial,
    PlaneBufferGeometry,
    PlaneGeometry,
    RGBFormat,
    Vector2,
    VideoTexture
} from 'three';
import {
    BACKGROUND_BLACK_COLOR,
    BOTTOM_BUTTON_SPACE,
    BOTTOM_SPACE,
    MULTIPLY_SCALAR,
    PROGRESS_BAR_WIDTH,
    QUALITY_X,
    QUALITY_Y,
    SOUND_BACKGROUND,
    SPACE_BETWEEN_BUTTONS,
    TEXT_STYLE_FAMILY_FONT,
    TIMER_POSITION,
    UI_BASIC_COLOR,
    VIDEO_TITLE_HEIGHT,
    VIDEO_TITLE_QUALITY,
    VOLUME_BAR_CIRCLE_RADIUS,
    VOLUME_BAR_POSITION,
    VOLUME_BAR_WIDTH
} from './constants';
import {
    IDisableButtons,
    VBTubeButtons,
    VBTubeCinematographicBars,
    VBTubeProgressbar,
    VBTubeSubtitles,
    VBTubeTimer,
    VBTubeVolumeBar
} from './';
import {TextComponent} from '@verybigthings/g.frame.components.text';
import {
    ActionController,
    ActionControllerEvent,
    ActionControllerEventName
} from '@verybigthings/g.frame.common.action_controller';
import {GMesh, GComponent} from '@verybigthings/g.frame.core';

export interface IVBTubeVideoPlayerOptions {
    videoScale: number;
    disableButtons?: IDisableButtons;
}


/**
 * VBTubeVideoPlayer is a main class that unites other modules, such as VBTubeButtons, VBTubeProgressbar, VBTubeSubtitles, etc.
 * It is extended form VideoViewerComponent, so you can set video as well and use different events
 */
export class VBTubeVideoPlayer extends GComponent {
    private progressbar: VBTubeProgressbar;
    private bars: VBTubeCinematographicBars;
    private buttons: VBTubeButtons;
    private subtitles: VBTubeSubtitles;
    private timer: VBTubeTimer;
    private volumebar: VBTubeVolumeBar;
    private videoTitle: TextComponent;
    private videoInited: boolean;
    private subtitlesText: Array<{ startTime: number, endTime: number, text: string }>;

    // Video params
    private videoScale: number;
    private videoParameters: any;
    private material: MeshBasicMaterial;
    private geometry: PlaneGeometry;
    private texture: VideoTexture;
    private video: HTMLVideoElement;
    private videoMesh: Mesh;
    private onEndListener: () => void;
    private onEndListener2: () => void;

    /**
     * Constructor of the class. Initializes all modules
     * @param videoParameters Wrapper, that is used to get width and height of the video. Also, it can contains subtitles text
     * @param actionController ActionController
     * @param controls ActionController
     */
    constructor(videoParameters: IVBTubeVideoPlayerOptions, private actionController: ActionController, private controls: { enableRotate: boolean }) {
        super();
        this.videoScale = Math.abs(videoParameters.videoScale) || 1;
        this.videoParameters = {
            width: QUALITY_X / QUALITY_Y * this.videoScale,
            height: this.videoScale,
            layer: 0.001 * Math.pow(1.01, this.videoScale)
        };

        this.geometry = new PlaneGeometry(this.videoParameters.width, this.videoParameters.height);
        this.material = new MeshBasicMaterial();
        this.addObject(this.videoMesh = new GMesh(this.geometry, this.material));

        // Title
        this.videoTitle = new TextComponent({
            size: new Vector2(
                this.videoParameters.width - this.videoParameters.width / PROGRESS_BAR_WIDTH,
                this.videoParameters.height / VIDEO_TITLE_HEIGHT
            ),
            pxSize: new Vector2(VIDEO_TITLE_QUALITY * 22.5, VIDEO_TITLE_QUALITY),
            text: {
                style: {
                    family: TEXT_STYLE_FAMILY_FONT,
                    weight: '500',
                    color: UI_BASIC_COLOR.getStyle(),
                    size: `${VIDEO_TITLE_QUALITY}px`
                },
                lineHeight: VIDEO_TITLE_QUALITY - VIDEO_TITLE_QUALITY / 7,
                margin: {bottom: 0},
                autoWrappingHorizontal: false,
                autoWrapping: false,
                align: 'left',
            },
            background: {
                color: BACKGROUND_BLACK_COLOR.getStyle(),
            }
        });
        this.videoTitle.uiObject.position.set(0, this.videoParameters.height / 2 - this.videoParameters.height / BOTTOM_SPACE, this.videoParameters.layer * 2);
        this.addObject(this.videoTitle);

        // Video progressbar
        this.progressbar = new VBTubeProgressbar(this.videoParameters, this.actionController);
        this.addObject(this.progressbar);

        // Cinematographic bars
        this.bars = new VBTubeCinematographicBars(this.videoParameters);
        this.addObject(this.bars);

        // Buttons
        this.buttons = new VBTubeButtons(this.videoParameters, videoParameters.disableButtons, this.actionController);
        this.addObject(this.buttons);

        // Subtitles
        this.subtitles = new VBTubeSubtitles(this.videoParameters, videoParameters.disableButtons, null);
        this.addObject(this.subtitles);

        // Timer
        this.timer = new VBTubeTimer(this.videoParameters);
        this.timer.uiObject.position.set(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS * TIMER_POSITION,
            this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_SPACE,
            this.videoParameters.layer * 5
        );
        this.addObject(this.timer);

        // Volume bar
        this.volumebar = new VBTubeVolumeBar(this.videoParameters, this.actionController);
        this.volumebar.uiObject.position.set(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS * VOLUME_BAR_POSITION,
            this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_BUTTON_SPACE, 0
        );
        this.addObject(this.volumebar);

        this.videoInited = false;
    }

    /**
     * Function to upload a video and prepare all modules to use
     * @param video Video to upload
     * @param videoTitle Title of the video.
     * @param subtitlesText Text for the subtitles. Try to have around two sentences in one text element of the Array for correct work
     */
    setVideo(video: HTMLVideoElement, videoTitle?: string, subtitlesText?: Array<{ startTime: number, endTime: number, text: string }>, autoPlay: boolean = false, disableButtons?: IDisableButtons) {
        this.videoParameters.width = video.videoWidth * this.videoScale / QUALITY_X * (QUALITY_X / QUALITY_Y);
        this.videoParameters.height = video.videoHeight * this.videoScale / QUALITY_Y;

        // console.log(this.videoScale, video.videoWidth, video.videoHeight);
        // Remove previous modules
        this.progressbar.dispose();
        this.videoTitle.dispose();
        this.volumebar.dispose();
        this.subtitles.dispose();
        this.buttons.dispose();
        this.timer.dispose();
        this.bars.dispose();

        // Title
        const videoQualityX = VIDEO_TITLE_QUALITY * video.videoWidth / QUALITY_X * 22.5;
        const videoQualityY = VIDEO_TITLE_QUALITY * video.videoHeight / QUALITY_Y;
        this.videoTitle = new TextComponent({
            size: new Vector2(
                this.videoParameters.width - this.videoParameters.width / PROGRESS_BAR_WIDTH,
                this.videoParameters.height / VIDEO_TITLE_HEIGHT
            ),
            pxSize: new Vector2(videoQualityX, videoQualityY),
            text: {
                style: {
                    family: TEXT_STYLE_FAMILY_FONT,
                    weight: '500',
                    color: UI_BASIC_COLOR.getStyle(),
                    size: `${videoQualityY}px`
                },
                lineHeight: videoQualityY - videoQualityY / 7,
                margin: {bottom: 0},
                autoWrappingHorizontal: false,
                autoWrapping: false,
                align: 'left',
            },
            background: {
                color: BACKGROUND_BLACK_COLOR.getStyle(),
            }
        });
        this.videoTitle.uiObject.position.set(0, this.videoParameters.height / 2 - this.videoParameters.height / BOTTOM_SPACE, this.videoParameters.layer * 2);
        this.addObject(this.videoTitle);

        // Video progressbar
        this.progressbar = new VBTubeProgressbar(this.videoParameters, this.actionController);
        this.addObject(this.progressbar);

        // Cinematographic bars
        this.bars = new VBTubeCinematographicBars(this.videoParameters);
        this.addObject(this.bars);

        // Buttons
        this.buttons = new VBTubeButtons(this.videoParameters, disableButtons, this.actionController);
        this.addObject(this.buttons);

        // Subtitles
        this.subtitles = new VBTubeSubtitles(this.videoParameters, disableButtons, subtitlesText);
        this.addObject(this.subtitles);

        // Timer
        this.timer = new VBTubeTimer(this.videoParameters);
        this.timer.uiObject.position.set(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS * TIMER_POSITION,
            this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_SPACE,
            this.videoParameters.layer * 5
        );
        this.addObject(this.timer);

        // Volume bar
        this.volumebar = new VBTubeVolumeBar(this.videoParameters, this.actionController);
        this.volumebar.uiObject.position.set(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS * VOLUME_BAR_POSITION,
            this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_BUTTON_SPACE, 0
        );
        this.addObject(this.volumebar);

        // Setting the video
        this.removeObject(this.videoMesh);
        this.geometry = new PlaneGeometry(this.videoParameters.width, this.videoParameters.height);
        this.addObject(this.videoMesh = new GMesh(this.geometry, this.material));

        if (this.texture) {
            this.texture.dispose();
        }
        if (this.video) {
            this.video.removeEventListener('ended', this.onEndListener);
            this.material.map = null;
        }
        if (video) {
            this.video = video;
            this.video.addEventListener('ended', this.onEndListener = () => {
                this.subtitlesText = null;
                this.subtitles.setText('');
                this.subtitles.show(false);
                this.progressbar.hideBufferLine();
                this.buttons.setText('replay', true);
                this.video.currentTime = 0;
                if (this.buttons.zoomButton && this.buttons.zoomButton.uiObject.userData.on) this.fire('compress');
                if (this.buttons.lightButton && !this.buttons.lightButton.uiObject.userData.on) this.fire('lightOn');
                this.fire('ended');
                // this.off('ended');
            });
            this.texture = new VideoTexture(this.video);
            this.texture.minFilter = LinearFilter;
            this.texture.format = RGBFormat;
        }
        this.material.map = this.texture;
        this.material.needsUpdate = true;

        videoTitle ? this.videoTitle.setText(videoTitle) : this.videoTitle.setText('');

        if (subtitlesText) {
            if (this.buttons.subtitlesButton) this.buttons.subtitlesButton.uiObject.visible = true;
            if (this.buttons.subtitlesButton) this.buttons.subtitlesButton.uiObject.userData.active = true;
        } else {
            if (this.buttons.subtitlesButton) this.buttons.subtitlesButton.uiObject.visible = false;
            if (this.buttons.subtitlesButton) this.buttons.subtitlesButton.uiObject.userData.active = false;
        }
        this.subtitlesText = subtitlesText;

        if (this.videoInited) {
            this.buttons.setText('play', false);
        }

        // Initialize all modules
        this.buttons.init();
        this.initProgressbar();
        this.initVolumebar();
        this.initButtons();

        // Show/hide UI
        this.uiObject.userData.tweenReady = true;
        this.actionController.on(ActionControllerEventName.over, this.uiObject, () => {
            if (!this.video.paused && this.controls.enableRotate && this.uiObject.userData.tweenReady) {
                this.showUI();
            }
        });
        this.actionController.on(ActionControllerEventName.out, this.uiObject, () => {
            if (!this.video.paused && this.controls.enableRotate && this.uiObject.userData.tweenReady) {
                this.hideUI();
            }
        });

        // this.showUI();

        if (autoPlay) this.buttons.fire('playButtonClicked');
        this.videoInited = true;
        return this;
    }

    /**
     * Function to update bars, subtitles and timer
     */
    update() {
        super.update();
        if (this.video && this.progressbar) {
            this.progressbar.updateProgressbar(this.video.currentTime, this.video.duration, this.video.buffered);
        }
        if (this.video && this.subtitles) {
            this.subtitles.setText('');
            this.subtitles.subtitlesWrapper.visible = false;
            for (let i in this.subtitlesText) {
                if (this.video.currentTime < this.subtitlesText[i].endTime && this.video.currentTime > this.subtitlesText[i].startTime && this.subtitlesText[i].text) {
                    this.subtitles.setText(this.subtitlesText[i].text);
                    this.subtitles.subtitlesWrapper.visible = true;
                }
            }
        }
        if (this.video && this.timer && this.video.duration) {
            this.timer.updateTimer(this.video.currentTime, this.video.duration);
        }
        this.buttons.setCurrentVolumeIcon(this.video.muted, this.video.volume);
    }

    showAutoSubtitles(show: boolean = true) {
        this.subtitles.show(show);
    }

    private setVideoVolume(x: number) {
        if (x * this.videoParameters.width / VOLUME_BAR_WIDTH < this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS) {
            this.video.volume = 0;
            this.video.muted = true;
            this.buttons.setText('sound', true);
        } else if (x * this.videoParameters.width / VOLUME_BAR_WIDTH < this.videoParameters.width / VOLUME_BAR_WIDTH - this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS) {
            this.video.volume = x;
            this.video.muted = false;
            this.buttons.setText('sound', false);
        } else {
            this.video.volume = 1;
            this.video.muted = false;
            this.buttons.setText('sound', false);
        }
        this.volumebar.updateVolumeBar(this.video.muted, this.video.volume);
    }

    /**
     * Function to declare actions and events for buttons
     */
    private initButtons() {
        // Play/Pause button
        this.buttons.on('playButtonClicked', () => {
            if (this.video.paused) {
                this.video.play();
                this.buttons.setText('play', true);
            } else {
                this.video.pause();
                this.buttons.setText('play', false);
            }
        });

        // Video screen clickable area
        this.buttons.on('screenClicked', () => {
            if (this.video.paused) {
                this.video.play();
                this.buttons.setText('play', true);
                this.buttons.animateScreenClickButton();
            } else {
                this.video.pause();
                this.buttons.setText('play', false);
                this.buttons.animateScreenClickButton();
            }
        });

        // Skip button
        this.buttons.on('skipButtonClicked', () => {
            this.video.currentTime = this.video.duration;
        });

        // Sound button
        this.buttons.on('soundButtonClicked', () => {
            if (!this.video.muted) {
                this.buttons.setText('volume', true);
                this.video.muted = true;
                this.volumebar.updateVolumeBar(this.video.muted, 0);
            } else if (this.video.muted) {
                this.buttons.setText('volume', false);
                this.video.muted = false;
                if (this.uiObject.userData.customVolume !== undefined) {
                    this.volumebar.updateVolumeBar(this.video.muted, this.uiObject.userData.customVolume);
                } else {
                    this.video.volume = 1;
                    this.volumebar.updateVolumeBar(this.video.muted, 1);
                }
            }
        });

        // Sound button
        this.buttons.on('soundButtonOver', () => {
            if (!this.timer.uiObject.userData.moved) {
                this.timer.uiObject.userData.moved = true;
                this.timer.move('right');
                const soundBackground = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
                    new PlaneBufferGeometry(this.videoParameters.width / 2, this.videoParameters.height / SOUND_BACKGROUND),
                    new MeshBasicMaterial({color: BACKGROUND_BLACK_COLOR, visible: false})
                );
                soundBackground.position.set(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS * (VOLUME_BAR_POSITION - 0.4), this.videoParameters.height / -2 + this.videoParameters.height / BOTTOM_SPACE, this.videoParameters.layer * 2);

                this.actionController.on(ActionControllerEventName.over, soundBackground, () => {
                });

                this.actionController.on(ActionControllerEventName.out, soundBackground, () => {
                    if (this.controls.enableRotate) {
                        this.timer.uiObject.userData.moved = false;
                        this.timer.move('left');
                        this.removeObject(soundBackground);
                    }
                });
                this.addObject(soundBackground);
            }
        });

        // Subtitles button
        this.buttons.on('subtitlesButtonClicked', () => {
            this.subtitles.show(true);
        });

        // Light button
        this.buttons.on('lightButtonClicked', () => {
            if (this.buttons.lightButton.uiObject.userData.on) {
                this.buttons.lightButton.uiObject.userData.on = false;
                this.buttons.setText('light', false);
                this.fire('lightOff');
            } else {
                this.buttons.lightButton.uiObject.userData.on = true;
                this.buttons.setText('light', true);
                this.fire('lightOn');
            }
        });

        // Zoom button
        this.buttons.on('zoomButtonClicked', () => {
            if (!this.buttons.zoomButton.uiObject.userData.on) {
                this.buttons.zoomButton.uiObject.userData.on = true;
                this.buttons.setText('expand', true);
                this.fire('expand');
            } else {
                this.buttons.zoomButton.uiObject.userData.on = false;
                this.buttons.setText('expand', false);
                this.fire('compress');
            }
        });
    }

    private initVolumebar() {
        // Button down action
        this.volumebar.on('volumebarButtonDown', (event: ActionControllerEvent) => {
            this.controls.enableRotate = false;
            const supplyBackground = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
                new PlaneBufferGeometry(this.videoParameters.width * MULTIPLY_SCALAR, this.videoParameters.height * MULTIPLY_SCALAR),
                new MeshBasicMaterial({visible: false})
            );
            this.addObject(supplyBackground);
            const volumeBackground = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
                new PlaneBufferGeometry(this.videoParameters.width / VOLUME_BAR_WIDTH, this.videoParameters.height * MULTIPLY_SCALAR),
                new MeshBasicMaterial({visible: false})
            );
            volumeBackground.position.set(this.videoParameters.width / -2 + this.videoParameters.width / SPACE_BETWEEN_BUTTONS * VOLUME_BAR_POSITION,
                0, this.videoParameters.layer * 2);

            if (event.data.intersection.uv.x * this.videoParameters.width / VOLUME_BAR_WIDTH < this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS) {
                this.uiObject.userData.customVolume = undefined;
            } else if (event.data.intersection.uv.x * this.videoParameters.width / VOLUME_BAR_WIDTH >= this.videoParameters.width / VOLUME_BAR_WIDTH - this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS) {
                this.uiObject.userData.customVolume = undefined;
            } else {
                this.uiObject.userData.customVolume = event.data.intersection.uv.x;
            }
            this.setVideoVolume(event.data.intersection.uv.x);

            // Move action
            this.actionController.on(ActionControllerEventName.move, volumeBackground, (event: ActionControllerEvent) => {
                if (event.data.intersection.uv.x * this.videoParameters.width / VOLUME_BAR_WIDTH < this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS) {
                    this.uiObject.userData.customVolume = undefined;
                } else if (event.data.intersection.uv.x * this.videoParameters.width / VOLUME_BAR_WIDTH >= this.videoParameters.width / VOLUME_BAR_WIDTH - this.videoParameters.height / VOLUME_BAR_CIRCLE_RADIUS) {
                    this.uiObject.userData.customVolume = undefined;
                } else {
                    this.uiObject.userData.customVolume = event.data.intersection.uv.x;
                }
                this.setVideoVolume(event.data.intersection.uv.x);
            });

            // Button up action
            this.actionController.once(ActionControllerEventName.buttonUp, null, () => {
                this.controls.enableRotate = true;
                this.removeObject(supplyBackground);
                this.removeObject(volumeBackground);
            });
            this.addObject(volumeBackground);
        });
    }

    private initProgressbar() {
        // Click action
        this.progressbar.on('progressbarClicked', (event: ActionControllerEvent) => {
            this.video.currentTime = event.data.intersection.uv.x * this.video.duration;
        });

        // Button down action
        this.progressbar.on('progressbarButtonDown', (event: ActionControllerEvent) => {
            this.controls.enableRotate = false;
            const supplyBackground = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
                new PlaneBufferGeometry(this.videoParameters.width * MULTIPLY_SCALAR, this.videoParameters.height * MULTIPLY_SCALAR),
                new MeshBasicMaterial({visible: false})
            );
            this.addObject(supplyBackground);
            const progressbarBackground = new GMesh<PlaneBufferGeometry, MeshBasicMaterial>(
                new PlaneBufferGeometry(this.videoParameters.width - this.videoParameters.width / PROGRESS_BAR_WIDTH, this.videoParameters.height * MULTIPLY_SCALAR),
                new MeshBasicMaterial({visible: false})
            );
            progressbarBackground.position.z = this.videoParameters.layer * 5;
            this.video.currentTime = event.data.intersection.uv.x * this.video.duration;
            this.progressbar.uiObject.userData.wasPaused = false;
            this.progressbar.uiObject.userData.pushed = true;
            if (!this.video.paused) {
                this.progressbar.uiObject.userData.wasPaused = true;
                this.video.pause();
            }

            // Move action
            this.actionController.on(ActionControllerEventName.move, progressbarBackground, (event: ActionControllerEvent) => {
                this.video.currentTime = event.data.intersection.uv.x * this.video.duration;
            });

            // Button up action
            this.actionController.once(ActionControllerEventName.buttonUp, null, () => {
                this.progressbar.uiObject.userData.pushed = false;
                this.controls.enableRotate = true;
                this.removeObject(supplyBackground);
                this.removeObject(progressbarBackground);
                if (!this.progressbar.uiObject.userData.isOver) {
                    this.progressbar.show(false);
                }
                if (this.progressbar.uiObject.userData.wasPaused) {
                    this.video.play();
                }
            });
            this.addObject(progressbarBackground);
        });
    }

    /**
     * Function to hide all modules
     */
    private hideUI() {
        new TWEEN.Tween({x: 0})
            .to({x: 1}, 40)
            .onStart(() => {
                this.uiObject.userData.tweenReady = true;
                this.buttons.hide(true);
                this.timer.hide(true);
                this.progressbar.uiObject.visible = false;
                this.volumebar.uiObject.visible = false;
                this.videoTitle.material.transparent = true;
            })
            .onUpdate((alpha) => {
                const a = 1 - alpha;
                this.videoTitle.material.opacity = a;
                this.subtitles.setTransition(alpha, true);
            })
            .onComplete(() => {
                this.bars.hide(true);
                this.uiObject.userData.tweenReady = true;
            })
            .start();
    }

    /**
     * Function to show all modules
     */
    private showUI() {
        new TWEEN.Tween({x: 0})
            .to({x: 1}, 40)
            .onStart(() => {
                this.uiObject.userData.tweenReady = true;
                this.bars.hide(false);
            })
            .onUpdate((alpha: any) => {
                this.videoTitle.material.opacity = alpha;
                this.subtitles.setTransition(alpha, false);
            })
            .onComplete(() => {
                this.timer.hide(false);
                this.buttons.hide(false);
                this.volumebar.uiObject.visible = true;
                this.progressbar.uiObject.visible = true;
                this.uiObject.userData.tweenReady = true;
                this.videoTitle.material.transparent = false;
            })
            .start();
    }
}