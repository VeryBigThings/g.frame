export interface IIconButtonComponentOptions {
    diameter: number;
    text: string;
    weight?: string;
    pxRatio?: number; // default is 6
    iconSize?: number; // goes from 1 (maximum sized square inside circle) to 0
    textColor?: string | CanvasGradient | CanvasPattern; // default is white
    background?: string; // default is black
    differenceBetweenSizeAndLineHeight?: number; // default is 4 for FontAwesome
}