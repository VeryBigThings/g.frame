import {TextViewerModule} from './TextViewerModule';
import {ITextComponentOptions} from './TextComponent_interfaces';

export class TextComponent extends TextViewerModule {
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
