import {Vector2} from 'three';

export interface ITextGComponentOptionsTextMargin {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}

export interface ITextGComponentOptionsTextStyle {
    color?: string | CanvasGradient | CanvasPattern;
    style?: string;
    weight?: string;
    family?: string;
    size?: string;
}

export interface ITextGComponentOptionsText {
    margin?: number | ITextGComponentOptionsTextMargin;
    style?: ITextGComponentOptionsTextStyle;
    align?: CanvasTextAlign;
    lineHeight?: number;
    autoWrapping?: boolean;
    autoWrappingHorizontal?: boolean;
    value?: string;
}

export interface ITextGComponentOptionsBackgroundBorder {
    width?: number;
    color?: string;
}

export interface ITextGComponentOptionsBackground {
    size?: Vector2;
    style?: string;
    color?: string;
    border?: ITextGComponentOptionsBackgroundBorder;
    radius?: number;
}

export interface ITextGComponentOptions {
    text?: ITextGComponentOptionsText;
    background?: ITextGComponentOptionsBackground;
}