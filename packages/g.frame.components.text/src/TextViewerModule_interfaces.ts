import {Vector2} from 'three';

export interface ITextViewerModuleOptionsTextMargin {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}

export interface ITextViewerModuleOptionsTextStyle {
    color?: string | CanvasGradient | CanvasPattern;
    style?: string;
    weight?: string;
    family?: string;
    size?: string;
}

export interface ITextViewerModuleOptionsText {
    margin?: number | ITextViewerModuleOptionsTextMargin;
    style?: ITextViewerModuleOptionsTextStyle;
    align?: CanvasTextAlign;
    lineHeight?: number;
    autoWrapping?: boolean;
    autoWrappingHorizontal?: boolean;
    value?: string;
}

export interface ITextViewerModuleOptionsBackgroundBorder {
    width?: number;
    color?: string;
}

export interface ITextViewerModuleOptionsBackground {
    size?: Vector2;
    style?: string;
    color?: string;
    border?: ITextViewerModuleOptionsBackgroundBorder;
    radius?: number;
}

export interface ITextViewerModuleOptions {
    text?: ITextViewerModuleOptionsText;
    background?: ITextViewerModuleOptionsBackground;
}