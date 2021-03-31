import {AbstractGamepad, GamepadEvents} from './AbstractGamepad';
import {ParentEvent} from '@verybigthings/g.frame.core';
import {IGamepadButton, IGamepadModel, IGamepadStick} from "./interfaces";
import {Vector2} from 'three';

const btnConfig = {
    0: 'cross',
    1: 'circle',
    2: 'square',
    3: 'triangle',
    4: 'l1',
    5: 'r1',
    6: 'l2',
    7: 'r2',
    8: 'share',
    9: 'options',
    10: 'stickLeft',
    11: 'stickRight',
    12: 'top',
    13: 'down',
    14: 'left',
    15: 'right',
    16: 'ps',
    17: 'touchpad',
};

export class GamepadModel extends AbstractGamepad {
    private keyPressed: Array<any> = [];
    public model: IGamepadModel;
    private axes: any;
    // private callBacks: any;
    private gamepad: Gamepad;
    private onGamepadConnected: (event) => void;
    private onGamepadDisconnected: (event) => void;

    constructor() {
        super();

        const allGamepads = navigator.getGamepads();

        for (let i = 0; i < allGamepads.length; i++) {
            if (allGamepads[i] !== null && allGamepads[i].id && !allGamepads[i].pose &&
                (allGamepads[i].id.toLowerCase().includes('steelseries') || allGamepads[i].id.toLowerCase().includes('xbox') || allGamepads[i].id.toLowerCase().includes('controller') || allGamepads[i].id.toLowerCase().includes('joystick') || allGamepads[i].id.toLowerCase().includes('dualshock'))) {
                this.gamepad = allGamepads[i];
            }
        }

        const emptyButtonData: IGamepadButton = {touched: false, clicked: false, pressed: false, value: 0};

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

        // window.addEventListener('gamepadconnected', this.onGamepadConnected = (event: GamepadEvent) => {
        //     console.log(event);
        //     if (!this.gamepad) this.gamepad = event.gamepad;
        // });
        //
        // window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected = (event: GamepadEvent) => {
        //     console.log(event);
        // });
        // this.keysPressed = [];
        // window.addEventListener('keydown', this.keydownEvent = event => {
        //     this.fire(GamepadEvents.keyDown, new ParentEvent(GamepadEvents.keyDown));
        //     if (this.keysPressed.indexOf(event.key) === -1) this.keysPressed.push(event.key);
        //     this.fire(GamepadEvents.keyPressed, new ParentEvent(GamepadEvents.keyPressed, {
        //         key: event.key,
        //         keyCode: event.keyCode,
        //         code: event.code
        //     }));
        //
        //     if (event.code === 'Backspace') {
        //         this.fire(GamepadEvents.onDelete);
        //     } else if (event.code === 'Escape') {
        //         this.fire(GamepadEvents.onUnFocus);
        //     } else if (event.keyCode === 13) { // this is both Enter buttons
        //         this.fire(GamepadEvents.onSubmit);
        //     } else if (event.key.length <= 1) {
        //         this.fire(GamepadEvents.onEnterSymbol, new ParentEvent<GamepadEvents>(GamepadEvents.onEnterSymbol, {
        //             key: event.key,
        //             keyCode: event.keyCode,
        //             code: event.code
        //         }));
        //     }
        //
        // });
        // window.addEventListener('keyup', this.keyupEvent = event => {
        //     const key = event.key;
        //     this.fire(GamepadEvents.keyUp, new ParentEvent(GamepadEvents.keyUp));
        //     this.keysPressed.splice(this.keysPressed.indexOf(key), 1);
        // });

        // this.enabled = true;

        this.axes = {
            pitch : {min: -1, max: 1, gamePadvalue: 0},
            roll : {min: -1, max: 1, gamePadvalue: 0},
            yaw : {min: -1, max: 1, gamePadvalue: 0},
            updown : { min : -1, max : 1, gamePadvalue : 0},
            action : { min : -1, max : 1, gamePadvalue : 0},
            changeView : { min : -1, max : 1, gamePadvalue : 0, value: 0, keyboard : { max: 32 }, toggle : true, toggled : false },
            pause : { min : -1, max : 1, gamePadvalue : 0, value: 0, keyboard : { max: 27 }, toggle : true, toggled : false },
            reset : { min : -1, max : 1, gamePadvalue : 0, value: 0, keyboard : { max: 13 } },
            restart : { min : -1, max : 1, gamePadvalue : 0, value: 0, keyboard : { max: 18 } },
            camera : { min : -1, max : 1, gamePadvalue : 0, value: 0, keyboard : { min: 70, max: 82 } },
            cameraLeftRight : { min : -1, max : 1, gamePadvalue : 0, value: 0, keyboard : { min: 69, max: 84 } },
            cameraZoom : { min : -1, max : 1, gamePadvalue : 0, value: 0, keyboard : { min: 71, max: 84 } },
        };

        // this.callBacks = {
        //     pitch: [],
        //     roll: [],
        //     yaw: [],
        //     updown: [],
        //     action: [],
        //     changeView: [],
        //     reset: [],
        //     restart: [],
        //     camera: [],
        //     all: []
        // };
    }

    private updateModel() {
        this.model.stickLeft.axes = new Vector2(this.gamepad.axes[0], this.gamepad.axes[1]);
        this.model.stickRight.axes = new Vector2(this.gamepad.axes[2], this.gamepad.axes[3]);
        // this.model.trigger.value = gamepad.buttons[0].value;
        // this.model.squeeze.value = gamepad.buttons[1].value;
        this.gamepad.buttons.forEach((gamepadBtn: GamepadButton, indexBtn: number) => {
            this.model[btnConfig[indexBtn]] && (this.model[btnConfig[indexBtn]] = {...gamepadBtn});
            // this.model[btnConfig[indexBtn]] && (this.model[btnConfig[indexBtn]].pressed = gamepadBtn.pressed);
            // this.model[btnConfig[indexBtn]] && (this.model[btnConfig[indexBtn]].value = gamepadBtn.value);
        });
    }

    private updateEvents() {
        // this.model.stickLeft.axes = new Vector2(this.gamepad.axes[0], this.gamepad.axes[1]);
        // this.model.stickRight.axes = new Vector2(this.gamepad.axes[2], this.gamepad.axes[3]);
        this.gamepad.buttons.forEach((gamepadBtn: GamepadButton, indexBtn: number) => {
            // this.model[btnConfig[indexBtn]] && (this.model[btnConfig[indexBtn]] = {...gamepadBtn});
            // this.model[btnConfig[indexBtn]] && (this.model[btnConfig[indexBtn]].pressed = gamepadBtn.pressed);
            // this.model[btnConfig[indexBtn]] && (this.model[btnConfig[indexBtn]].value = gamepadBtn.value);
        });



        // const newButtonDown = inputSource.gamepad.buttons[0].pressed;
        //
        // this.fire(XRControllerModelEvents.move, new ParentEvent(XRControllerModelEvents.move, this.getEventData(code)));
        // if (!model.trigger.pressed && newButtonDown) {
        //     this.fire(XRControllerModelEvents.buttonDown, new ParentEvent(XRControllerModelEvents.buttonDown, this.getEventData(code)));
        // }
        // if (model.trigger.pressed && !newButtonDown) {
        //     this.fire(XRControllerModelEvents.buttonUp, new ParentEvent(XRControllerModelEvents.buttonUp, this.getEventData(code)));
        //     this.fire(XRControllerModelEvents.click, new ParentEvent(XRControllerModelEvents.click, this.getEventData(code)));
        // }
        // // model.trigger.pressed = newButtonDown;
    }


    onKeyChanged() {
        // if(!window.isPlaying) return;
        // if(!this.enabled) return;
        for (let name in this.axes) {
            let axis = this.axes[name];
            // @ts-ignore
            let minPressed = false;
            let maxPressed = false;
            let value = axis.value;

            if (axis.toggle) {
                if (maxPressed && value === axis.max && !axis.toggled) {
                    axis.value = 0;
                    axis.toggled = true;
                } else if (maxPressed && value === 0 && !axis.toggled) {
                    axis.value = axis.max;
                    axis.toggled = true;
                } else if (!maxPressed && (value === axis.max || value === 0)) {
                    axis.toggled = false;
                }
                continue;
            }

            if (!minPressed && !maxPressed && value !== 0 && axis.gamePadvalue === 0) {
                axis.value = 0;
                this.fire(GamepadEvents.keyPressed, new ParentEvent(GamepadEvents.keyPressed, {
                    name: name,
                    value: value
                }));
            }
            else if (!minPressed && !maxPressed && axis.gamePadvalue !== 0) {
                axis.value = axis.gamePadvalue;
                this.fire(GamepadEvents.keyPressed, new ParentEvent(GamepadEvents.keyPressed, {
                    name: name,
                    value: value
                }));
            }
            else if (minPressed && !maxPressed && value !== axis.min) {
                axis.value = axis.min;
                this.fire(GamepadEvents.keyPressed, new ParentEvent(GamepadEvents.keyPressed, {
                    name: name,
                    value: value
                }));
            }
            else if (!minPressed && maxPressed && value !== axis.max) {
                axis.value = axis.max;
                this.fire(GamepadEvents.keyPressed, new ParentEvent(GamepadEvents.keyPressed, {
                    name: name,
                    value: value
                }));
            }
        }
    }

    // onDocumentKeyDown(event) {
    //     // if (!window.isPlaying) return;
    //
    //     const keyCode = event.which;
    //     if (!this.keyPressed.includes(keyCode)) {
    //         this.keyPressed.push(keyCode);
    //         this.onKeyChanged();
    //     }
    //
    // }

    // onDocumentKeyUp(event) {
    //     // if (!window.isPlaying) return;
    //
    //     const keyCode = event.which;
    //     const keyPos = this.keyPressed.indexOf(keyCode);
    //     if (keyPos > -1) {
    //         this.keyPressed.splice(keyPos, 1);
    //         this.onKeyChanged();
    //     }
    //
    // }

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
        // console.log('updateGamepad', this.gamepad);
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
        }

        // this.fire(XRControllerModelEvents.controllerChanged, new ParentEvent(XRControllerModelEvents.controllerChanged, this.model));


        // if (this.gamepad) {
        //
        //     if (Math.abs(+this.gamepad.axes[0].toFixed(2)) >= 0.12) {
        //         // this.axes.yaw.gamePadvalue = -(+this.gamepad.axes[0].toFixed(1));
        //         console.log('this.gamepad.axes[0]', this.gamepad.axes);
        //     }
        //     else {
        //         this.axes.yaw.gamePadvalue = 0;
        //     }
        //     if (Math.abs(+this.gamepad.axes[1].toFixed(2)) >= 0.12) {
        //         this.axes.updown.gamePadvalue = -(+this.gamepad.axes[1].toFixed(1));
        //         console.log('this.gamepad.axes[1]', this.gamepad.axes);
        //     }
        //     else {
        //         this.axes.updown.gamePadvalue = 0;
        //     }
        //     if (Math.abs(+this.gamepad.axes[2].toFixed(2)) >= 0.12) {
        //         this.axes.roll.gamePadvalue = -(+this.gamepad.axes[2].toFixed(1));
        //         console.log('this.gamepad.axes[2]', this.gamepad.axes);
        //     } else {
        //         this.axes.roll.gamePadvalue = 0;
        //     }
        //     if (Math.abs(+this.gamepad.axes[3].toFixed(2)) >= 0.12) {
        //         this.axes.pitch.gamePadvalue = -(+this.gamepad.axes[3].toFixed(1));
        //         console.log('this.gamepad.axes[3]', this.gamepad.axes);
        //     } else {
        //         this.axes.pitch.gamePadvalue = 0;
        //     }
        //
        //     this.gamepad.buttons.forEach((gamepadBtn, btnIndex) => {
        //         if (gamepadBtn.pressed) console.log('pressed', gamepadBtn, btnIndex);
        //         if (gamepadBtn.touched) console.log('touched', gamepadBtn, btnIndex);
        //     });
        //
        //     // if (this.gamepad.buttons[0].pressed) {
        //     //     this.axes.action.gamePadvalue = this.axes.action.max;
        //     // } else {
        //     //     this.axes.action.gamePadvalue = 0;
        //     // }
        //     //
        //     // if (this.gamepad.buttons[3].pressed) {
        //     //     this.axes.reset.gamePadvalue = this.axes.reset.max;
        //     // } else {
        //     //     this.axes.reset.gamePadvalue = 0;
        //     // }
        //     //
        //     // if (this.gamepad.buttons[4].pressed) {
        //     //     if (!this.keyPressed.includes(32)) {
        //     //         this.keyPressed.push(32);
        //     //         // this.onKeyChanged();
        //     //     }
        //     // } else {
        //     //     const keyPos = this.keyPressed.indexOf(32);
        //     //     if (keyPos > -1) {
        //     //         this.keyPressed.splice(keyPos, 1);
        //     //         // this.onKeyChanged();
        //     //     }
        //     // }
        //     //
        //     // if (this.gamepad.buttons[2].pressed) {
        //     //     if (!this.keyPressed.includes(9)) {
        //     //         this.keyPressed.push(9);
        //     //         // this.onKeyChanged();
        //     //     }
        //     // } else {
        //     //     const keyPos = this.keyPressed.indexOf(9);
        //     //     if (keyPos > -1) {
        //     //         this.keyPressed.splice(keyPos, 1);
        //     //         // this.onKeyChanged();
        //     //     }
        //     // }
        //     //
        //     // if (this.gamepad.buttons[12].pressed) {
        //     //     this.axes.camera.gamePadvalue = this.axes.camera.max;
        //     // } else if (this.gamepad.buttons[13].pressed) {
        //     //     this.axes.camera.gamePadvalue = this.axes.camera.min;
        //     // } else {
        //     //     this.axes.camera.gamePadvalue = 0;
        //     // }
        //     //
        //     // if (this.gamepad.buttons[15].pressed) {
        //     //     this.axes.cameraLeftRight.gamePadvalue = this.axes.cameraLeftRight.max;
        //     // } else if (this.gamepad.buttons[14].pressed) {
        //     //     this.axes.cameraLeftRight.gamePadvalue = this.axes.cameraLeftRight.min;
        //     // } else {
        //     //     this.axes.cameraLeftRight.gamePadvalue = 0;
        //     // }
        //     //
        //     // if (this.gamepad.buttons[6].pressed) {
        //     //     this.axes.cameraZoom.gamePadvalue = this.axes.cameraZoom.max;
        //     // } else if (this.gamepad.buttons[7].pressed) {
        //     //     this.axes.cameraZoom.gamePadvalue = this.axes.cameraZoom.min;
        //     // } else {
        //     //     this.axes.cameraZoom.gamePadvalue = 0;
        //     // }
        //     //
        //     // this.onKeyChanged();
        // }
    }

    vibrate(duration: number = 500, power: number = 1, delay: number = 0) {
        // @ts-ignore
        if (!this.gamepad && !this.gamepad.vibrationActuator) return;

        // @ts-ignore
        this.gamepad.vibrationActuator.playEffect('dual-rumble', {
            startDelay: delay, // Add a delay in milliseconds
            duration: duration, // Total duration in milliseconds
            weakMagnitude: power, // intensity (0-1) of the small ERM
            strongMagnitude: power // intesity (0-1) of the bigger ERM
        })
            .then(() => {
                this.fire(GamepadEvents.vibrationDone);
            });
    }


    dispose() {
        window.removeEventListener('gamepadconnected', this.onGamepadConnected);
        window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    }

}
