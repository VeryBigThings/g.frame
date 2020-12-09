import {TextGComponent} from './TextGComponent';
import {ITextComponentOptions} from './TextComponent_interfaces';

export class TextComponent extends TextGComponent {
    public options: ITextComponentOptions;

    constructor(options: ITextComponentOptions) {
        super(options.pxSize, options.size);
        this.options = options;
        this.updateElement(this.options);
    }

    public setText(text: string) {
        this.options.text.value = text;
        this.updateElement(this.options);
    }
}
