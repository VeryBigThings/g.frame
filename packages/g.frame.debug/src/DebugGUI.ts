import * as dat from 'dat.gui';
import { EventDispatcher, ParentEvent } from '@verybigthings/g.frame.core';

export interface DebugGUIFieldOptions {
    name: string;
    value: string | number | boolean;
    min?: number;
    max?: number;
    callback?: () => void;
    options?: Array<number | string>;
    type: 'text' | 'color' | 'number' | 'button' | 'select' | 'checkbox';
    controller?: dat.GUIController;
}

export class DebugGUI extends EventDispatcher<any> {
    private readonly fields: Array<DebugGUIFieldOptions> = [];
    private datGUI: dat.GUI;
    private readonly values: {} = {};

    constructor() {
        super();
    }

    addColor(name: string, value: string) {
        return this.addField({
            name: name,
            value: value,
            type: 'color'
        });
    }

    addCheckbox(name: string, value: boolean) {
        return this.addField({
            name: name,
            value: value,
            type: 'checkbox'
        });
    }

    addButton(name: string, callback: () => void) {
        return this.addField({
            name: name,
            callback: callback,
            type: 'button',
            value: 0
        });
    }

    addNumber(name: string, value: number, min: number, max: number) {
        return this.addField({
            name: name,
            value: value,
            min: min,
            max: max,
            type: 'number'
        });
    }

    addTextInput(name: string, value: string) {
        return this.addField({
            name: name,
            value: value,
            type: 'text'
        });
    }

    addSelect(name: string, value: string, options: Array<string>) {
        return this.addField({
            name: name,
            value: value,
            options: options,
            type: 'select'
        });
    }

    enableField(name: string) {
        if (!this.datGUI) {
            this.datGUI = new dat.GUI();
        }
        const options = this.fields.find((options) => options.name === name);
        if (!options) {
            console.warn(`No options with name ${name} is registered in DebugGUI`);
            return;
        }
        this.values[options.name] = options.value !== undefined ? options.value : options.callback;
        options.controller = (() => {
            if (['text', 'checkbox', 'button'].includes(options.type))
                return this.datGUI.add(this.values, options.name);
            else if (options.type === 'color')
                return this.datGUI.addColor(this.values, options.name);
            else if (options.type === 'number')
                return this.datGUI.add(this.values, options.name, options.min, options.max);
            else if (options.type === 'select')
                return this.datGUI.add(this.values, options.name, options.options);
        })();

        options.controller.onChange((value => this.fire(`change_${options.name}`, new ParentEvent(null, {value: value}))));
    }

    disableField(name: string) {
        const options = this.fields.find((options) => options.name === name);
        if (!options) {
            console.warn(`No options with name ${name} is registered in DebugGUI`);
            return;
        }
        if (!options.controller) {
            console.warn(`No controller in options with name ${name} is registered in DebugGUI`);
            return;
        }
        this.datGUI.remove(options.controller);
        options.controller = null;
    }

    private addField(options: DebugGUIFieldOptions) {
        this.fields.push(options);
    }
}