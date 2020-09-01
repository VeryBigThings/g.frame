import {Loader} from '../Loader';

enum FontFaceLoadStatus { unloaded, loading, loaded, error }

export interface IFontFace {
    family: 'string';
    style: 'string';
    weight: 'string';
    stretch: 'string';
    unicodeRange: 'string';
    variant: 'string';
    featureSettings: 'string';
    variationSettings: 'string';
    display: 'string';

    load: () => Promise<IFontFace>;
    readonly status: FontFaceLoadStatus;
    readonly loaded: Promise<IFontFace>;
}

declare function FontFace(name: string, url: string, config: { style: string; weight: number }): void;

export const FONT = 'font';


export default class FontsLoader extends Loader<IFontFace> {
    public readonly loaderType: string = FONT;
    private readonly nameExp: RegExp;

    constructor() {
        super();
        this.nameExp = new RegExp('^(.+)&(.+)-(.+)-(.+)$');
    }

    protected resourceToPromise(url: string, name: string, crossOrigin?: string): Promise<IFontFace> {
        return new Promise((resolve, reject) => {
            const fontParams = name.match(this.nameExp);
            if (fontParams) {
                const fontName = fontParams[1];
                const fontWeight = +fontParams[3];
                const fontStyle = fontParams[4];

                const loader = new FontFace(fontName, `url(${url})`, {style: fontStyle, weight: fontWeight});
                // loader.setCrossOrigin('use-credentials');
                loader.load().then((loaded_face) => {
                    this.library.set(name, loaded_face);
                    (<any>document).fonts.add(loaded_face);
                    resolve(loaded_face);
                }).catch(function (error) {
                    reject(error);
                });
            } else {
                reject('incorrect font name');
            }
        });
    }
}