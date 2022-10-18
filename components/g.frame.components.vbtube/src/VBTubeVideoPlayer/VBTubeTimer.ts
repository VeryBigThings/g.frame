import {
    BACKGROUND_BLACK_COLOR,
    TEXT_STYLE_FAMILY_FONT,
    TIMER_HEIGHT,
    TIMER_TRANSITION,
    TIMER_WIDTH,
    UI_BASIC_COLOR
} from './constants';
import {Vector2} from 'three';
import {GframeModule} from '@g.frame/core';
import {TextComponent} from '@g.frame/components.text';

/**
 * Class to add HH:MM:SS timer
 */
export class VBTubeTimer extends GframeModule {
    private timer: TextComponent;

    /**
     * Constructor of the class. Adds timer to the scene
     * @param videoParameters Standard param to set optimal size for timer
     */
    constructor(private videoParameters: any) {
        super();

        // Timer
        const x = this.videoParameters.width / TIMER_WIDTH;
        const y = this.videoParameters.height / TIMER_HEIGHT;
        const TIMER_QUALITY = 64;
        this.timer = new TextComponent({
            size: new Vector2(x, y),
            pxSize: new Vector2(TIMER_QUALITY * x / y, TIMER_QUALITY),
            text: {
                style: {
                    family: TEXT_STYLE_FAMILY_FONT,
                    weight: '500',
                    color: UI_BASIC_COLOR.getStyle(),
                    size: `${TIMER_QUALITY}px`
                },
                value: '0:00 / 0:00',
                lineHeight: TIMER_QUALITY - TIMER_QUALITY / 7,
                margin: {bottom: 0},
                autoWrappingHorizontal: false,
                autoWrapping: false,
                align: 'left',
            },
            background: {
                color: BACKGROUND_BLACK_COLOR.getStyle()
            }
        });
        this.addObject(this.timer);

        // UiObject name
        this.uiObject.name = 'timer';
    }

    /**
     * Static method to convert seconds into HH:MM:SS format
     * @param timeInSeconds As named
     */
    static convertToDigitalTimer(timeInSeconds: number) {
        timeInSeconds = Math.round(timeInSeconds);
        let time: string = '';
        let minutes = (timeInSeconds % 3600);

        const hours = (timeInSeconds - minutes) / 3600;
        const seconds = (minutes % 60);
        minutes = (minutes - seconds) / 60;

        if (hours > 0) {
            time += hours + ':';
        }

        if (minutes === 0) {
            time += '0:';
        } else if (hours > 0 && minutes < 10) {
            time += '0' + minutes + ':';
        } else {
            time += minutes + ':';
        }

        if (seconds === 0) {
            time += '00';
        } else if (seconds < 10) {
            time += '0' + seconds;
        } else {
            time += seconds;
        }

        return time;
    }

    hide(hide: boolean) {
        if (hide) {
            this.timer.uiObject.visible = false;
        } else {
            this.timer.uiObject.visible = true;
        }
    }

    move(where: 'left' | 'right') {
        const destination = this.timer.uiObject.position.clone();

        if (where === 'right') {
            destination.x = this.videoParameters.width / TIMER_TRANSITION;
        } else if (where === 'left') {
            destination.x = 0;
        }

        new TWEEN.Tween(this.timer.uiObject.position)
            .to(destination, 150)
            .start();
    }

    updateTimer(currentTime: number, duration: number) {
        this.timer.setText(`${VBTubeTimer.convertToDigitalTimer(currentTime)} / ${VBTubeTimer.convertToDigitalTimer(duration)}`);
    }
}