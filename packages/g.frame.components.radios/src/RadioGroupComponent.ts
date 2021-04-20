import {ObjectsPositioning, ViewerModule} from '@g.frame/core';
import {CheckRadioComponent, ICheckRadioComponentOptions} from './CheckRadioComponent';
import {Vector2} from 'three';
import {ActionController} from '@g.frame/common.action_controller';

export interface IRadioGroupComponentOptions {
    radioData: Array<string>;
    activeNumber: number;
    spaceBetween: number;
    textOptions?: ICheckRadioComponentOptions;
}

export class RadioGroupComponent extends ViewerModule {
    public radioItems: Array<CheckRadioComponent> = [];
    public numbActive: number;
    public radioData: Array<string>;
    public textOptions: ICheckRadioComponentOptions;

    constructor(private options: IRadioGroupComponentOptions, private actionController: ActionController) {
        super();


        this.textOptions = this.options.textOptions || {
            isCheckbox: false,
            background: {color: '#FFF'},
            size: new Vector2(8, 1.7),
            pxSize: new Vector2(256, 64),
            text: {
                value: '',
                align: 'left',
                autoWrappingHorizontal: false,
                autoWrapping: true,
                lineHeight: 20,
                style: {size: '25px'}
            },
        };


        this.options.radioData.forEach((radioDataItem) => {
            this.textOptions.text.value = radioDataItem;

            const radioItem = new CheckRadioComponent(this.textOptions, this.actionController);

            this.radioItems.push(radioItem);
            this.addObject(radioItem);
        });


        ObjectsPositioning.adjustObjects(this.radioItems.reverse().map(ratioItem => ratioItem.uiObject), false, this.options.spaceBetween);

        this.radioItems.reverse();
        this.radioItems[this.options.activeNumber].checked = true;

        this.radioItems.forEach(radioItem => {
            radioItem.on('changed', (event) => {
                if (event.data.checked) {
                    const indexChangedRadioItem = this.radioItems.indexOf(event.data);
                    this.radioItems[this.numbActive].setUnchecked();
                    this.numbActive = indexChangedRadioItem;
                }
            });
        });
    }

    setActiveRadioItem(radioIndex: number = 0): CheckRadioComponent {
        let activeRadioItem = this.radioItems[this.numbActive];

        if (radioIndex !== this.numbActive) {
            this.radioItems[this.numbActive].setUnchecked();
            this.numbActive = radioIndex;
            this.radioItems[this.numbActive].checked = true;
            activeRadioItem = this.radioItems[this.numbActive];
        }
        return activeRadioItem;
    }
}
