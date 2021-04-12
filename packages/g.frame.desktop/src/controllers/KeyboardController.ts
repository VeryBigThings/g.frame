import {ParentEvent} from 'g.frame.core';
import {Keyboard, KeyboardEvents} from 'g.frame.input';

export class KeyboardController extends Keyboard {
    public keysPressed: Array<string>;
    private keydownEvent: (event) => void;
    private keyupEvent: (event) => void;

    constructor() {
        super();
        this.keysPressed = [];
        window.addEventListener('keydown', this.keydownEvent = event => {
            this.fire(KeyboardEvents.keyDown, new ParentEvent(KeyboardEvents.keyDown, {
                key: event.key,
                keyCode: event.keyCode,
                code: event.code
            }));
            if (this.keysPressed.indexOf(event.key) === -1) this.keysPressed.push(event.key);
            this.fire(KeyboardEvents.keyPressed, new ParentEvent(KeyboardEvents.keyPressed, {
                key: event.key,
                keyCode: event.keyCode,
                code: event.code
            }));

            if (event.code === 'Backspace') {
                this.fire(KeyboardEvents.onDelete);
            } else if (event.code === 'Escape') {
                this.fire(KeyboardEvents.onUnFocus);
            } else if (event.keyCode === 13) { // this is both Enter buttons
                this.fire(KeyboardEvents.onSubmit);
            } else if (event.key.length <= 1) {
                this.fire(KeyboardEvents.onEnterSymbol, new ParentEvent<KeyboardEvents>(KeyboardEvents.onEnterSymbol, {
                    key: event.key,
                    keyCode: event.keyCode,
                    code: event.code
                }));
            }

        });
        window.addEventListener('keyup', this.keyupEvent = event => {
            const key = event.key;
            this.fire(KeyboardEvents.keyUp, new ParentEvent(KeyboardEvents.keyUp, {
                key: event.key,
                keyCode: event.keyCode,
                code: event.code
            }));
            this.keysPressed.splice(this.keysPressed.indexOf(key), 1);
        });
    }

    dispose() {
        window.removeEventListener('keydown', this.keydownEvent);
        window.removeEventListener('keyup', this.keyupEvent);
    }

}