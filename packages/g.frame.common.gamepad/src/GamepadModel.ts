import {AbstractGamepad, GamepadEvents} from './AbstractGamepad';
import {ParentEvent} from 'g.frame.core';
import {IGamepadButton, IGamepadModel, IGamepadStick} from './interfaces';
import {Vector2} from 'three';


export enum GamepadKeyNames {
    cross = 'cross',
    circle = 'circle',
    square = 'square',
    triangle = 'triangle',
    l1 = 'l1',
    r1 = 'r1',
    l2 = 'l2',
    r2 = 'r2',
    share = 'share',
    options = 'options',
    stickLeft = 'stickLeft',
    stickRight = 'stickRight',
    top = 'top',
    down = 'down',
    left = 'left',
    right = 'right',
    ps = 'ps',
    touchpad = 'touchpad',
}

const btnConfig = {
    0: GamepadKeyNames.cross,
    1: GamepadKeyNames.circle,
    2: GamepadKeyNames.square,
    3: GamepadKeyNames.triangle,
    4: GamepadKeyNames.l1,
    5: GamepadKeyNames.r1,
    6: GamepadKeyNames.l2,
    7: GamepadKeyNames.r2,
    8: GamepadKeyNames.share,
    9: GamepadKeyNames.options,
    10: GamepadKeyNames.stickLeft,
    11: GamepadKeyNames.stickRight,
    12: GamepadKeyNames.top,
    13: GamepadKeyNames.down,
    14: GamepadKeyNames.left,
    15: GamepadKeyNames.right,
    16: GamepadKeyNames.ps,
    17: GamepadKeyNames.touchpad,
};

export class GamepadModel extends AbstractGamepad {
    public model: IGamepadModel;
    private gamepad: Gamepad;
    private onGamepadConnected: (event) => void;
    private onGamepadDisconnected: (event) => void;
    private isStateChanged: boolean = false;

    constructor() {
        super();

        const allGamepads = navigator.getGamepads();

        for (let i = 0; i < allGamepads.length; i++) {
            if (allGamepads[i] !== null && allGamepads[i].id && !allGamepads[i].pose &&
                (allGamepads[i].id.toLowerCase().includes('steelseries') || allGamepads[i].id.toLowerCase().includes('xbox') || allGamepads[i].id.toLowerCase().includes('controller') || allGamepads[i].id.toLowerCase().includes('joystick') || allGamepads[i].id.toLowerCase().includes('dualshock'))) {
                this.gamepad = allGamepads[i];
            }
        }

        const emptyButtonData: IGamepadButton = {touched: false, pressed: false, value: 0};

        this.model = {
            enabled: true,
            stickLeft: {axes: new Vector2(), ...emptyButtonData},
            stickRight: {axes: new Vector2(), ...emptyButtonData},
            l1: {...emptyButtonData},
            r1: {...emptyButtonData},
            l2: {...emptyButtonData},
            r2: {...emptyButtonData},
            left: {...emptyButtonData},
            top: {...emptyButtonData},
            right: {...emptyButtonData},
            down: {...emptyButtonData},
            cross: {...emptyButtonData},
            circle: {...emptyButtonData},
            triangle: {...emptyButtonData},
            square: {...emptyButtonData},
            touchpad: {...emptyButtonData},
            share: {...emptyButtonData},
            options: {...emptyButtonData},
            ps: {...emptyButtonData},
        };

        console.log('this.model', this.model);

        // window.addEventListener('gamepadconnected', this.onGamepadConnected = (event: GamepadEvent) => {
        //     console.log(event);
        //     if (!this.gamepad) this.gamepad = event.gamepad;
        // });
        //
        // window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected = (event: GamepadEvent) => {
        //     console.log(event);
        // });
    }

    private updateModel() {
        this.model.stickLeft.axes = new Vector2(this.gamepad.axes[0], this.gamepad.axes[1]);
        this.model.stickRight.axes = new Vector2(this.gamepad.axes[2], this.gamepad.axes[3]);

        this.gamepad.buttons.forEach((gamepadBtn: GamepadButton, indexBtn: number) => {
            if (!this.model[btnConfig[indexBtn]]) return;

            this.model[btnConfig[indexBtn]].pressed = gamepadBtn.pressed;
            this.model[btnConfig[indexBtn]].touched = gamepadBtn.touched;
            this.model[btnConfig[indexBtn]].value = gamepadBtn.value;
        });
    }

    private updateEvents() {
        const stickLeftAxes = new Vector2(this.gamepad.axes[0], this.gamepad.axes[1]);
        const stickRightAxes = new Vector2(this.gamepad.axes[2], this.gamepad.axes[3]);

        // STICK EVENTS
        if (stickLeftAxes.length() > 0.05) {
            this.isStateChanged = true;
            this.fire(GamepadEvents.stickChanged, new ParentEvent(GamepadEvents.stickChanged, {
                stickName: GamepadKeyNames.stickLeft,
                axes: stickLeftAxes,
                timestamp: this.gamepad.timestamp
            }));
        }
        if (stickRightAxes.length() > 0.05) {
            this.isStateChanged = true;
            this.fire(GamepadEvents.stickChanged, new ParentEvent(GamepadEvents.stickChanged, {
                stickName: GamepadKeyNames.stickRight,
                axes: stickRightAxes,
                timestamp: this.gamepad.timestamp
            }));
        }

        this.gamepad.buttons.forEach((gamepadBtn: GamepadButton, indexBtn: number) => {
            if (!this.model[btnConfig[indexBtn]]) return;

            const keyEventData = {
                keyName: btnConfig[indexBtn],
                keyCode: indexBtn,
                pressed: gamepadBtn.pressed,
                touched: gamepadBtn.touched,
                value: gamepadBtn.value,
                timestamp: this.gamepad.timestamp
            };

            // PRESSED EVENTS
            if (!this.model[btnConfig[indexBtn]].pressed && gamepadBtn.pressed) {
                this.isStateChanged = true;
                this.fire(GamepadEvents.keyDown, new ParentEvent(GamepadEvents.keyDown, keyEventData));
            }
            else if (this.model[btnConfig[indexBtn]].pressed && gamepadBtn.pressed) {
                this.isStateChanged = true;
                this.fire(GamepadEvents.keyPressed, new ParentEvent(GamepadEvents.keyPressed, keyEventData));
            }
            else if (this.model[btnConfig[indexBtn]].pressed && !gamepadBtn.pressed) {
                this.isStateChanged = true;
                this.fire(GamepadEvents.keyUp, new ParentEvent(GamepadEvents.keyPressed, keyEventData));
            }


            // TOUCHED EVENTS
            if (!this.model[btnConfig[indexBtn]].touched && gamepadBtn.touched) {
                this.isStateChanged = true;
                this.fire(GamepadEvents.keyTouchStart, new ParentEvent(GamepadEvents.keyTouchStart, keyEventData));
            }
            else if (this.model[btnConfig[indexBtn]].touched && gamepadBtn.touched) {
                this.isStateChanged = true;
                this.fire(GamepadEvents.keyTouched, new ParentEvent(GamepadEvents.keyTouched, keyEventData));
            }
            else if (this.model[btnConfig[indexBtn]].touched && !gamepadBtn.touched) {
                this.isStateChanged = true;
                this.fire(GamepadEvents.keyTouchEnd, new ParentEvent(GamepadEvents.keyTouchEnd, keyEventData));
            }
        });
    }

    // gamePadConnected() {
    //     let allGamepads = navigator.getGamepads();
    //
    //     let gamepad;
    //
    //     let checkGamepad = false;
    //
    //     for (let i = 0; i < allGamepads.length; i++) {
    //         if (allGamepads[i] !== null && allGamepads[i].id && !allGamepads[i].pose && (allGamepads[i].id.toLowerCase().includes('steelseries') || allGamepads[i].id.toLowerCase().includes('xbox') || allGamepads[i].id.toLowerCase().includes('controller') || allGamepads[i].id.toLowerCase().includes('joystick'))) {
    //             checkGamepad = true;
    //             gamepad = allGamepads[i];
    //         }
    //     }
    //
    //     return checkGamepad;
    // }



    updateGamepad() {
        this.isStateChanged = false;

        let allGamepads = navigator.getGamepads();

        for (let i = 0; i < allGamepads.length; i++) {
            if (allGamepads[i] !== null && allGamepads[i].id && !allGamepads[i].pose &&
                (allGamepads[i].id.toLowerCase().includes('steelseries') || allGamepads[i].id.toLowerCase().includes('xbox') || allGamepads[i].id.toLowerCase().includes('controller') || allGamepads[i].id.toLowerCase().includes('joystick') || allGamepads[i].id.toLowerCase().includes('dualshock'))) {
                this.gamepad = allGamepads[i];
            }
        }

        if (this.gamepad) {
            this.updateEvents();
            this.updateModel();

            if (this.isStateChanged) {
                this.fire(GamepadEvents.changed, new ParentEvent(GamepadEvents.changed, {gamepadModel: this.model}));
            }
        }
    }

    vibrate(duration: number = 500, power: number = 1, delay: number = 0) {
        // @ts-ignore
        if (!this.gamepad && !this.gamepad.vibrationActuator) return;
        if (duration + delay > 5000) {
            console.error('The delay and duration of vibration should not exceed 5000ms');
            return;
        }

        // @ts-ignore
        this.gamepad.vibrationActuator.playEffect('dual-rumble', {
            startDelay: delay, // Add a delay in milliseconds
            duration: duration, // Total duration in milliseconds
            weakMagnitude: power, // intensity (0-1) of the small ERM
            strongMagnitude: power // intesity (0-1) of the bigger ERM
        })
            .then(() => this.fire(GamepadEvents.vibrationEnd));

        setTimeout(() => this.fire(GamepadEvents.vibrationStart), delay);
    }


    dispose() {
        // window.removeEventListener('gamepadconnected', this.onGamepadConnected);
        // window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    }

}
