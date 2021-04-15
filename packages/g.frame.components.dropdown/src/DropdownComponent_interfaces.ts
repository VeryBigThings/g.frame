import {Object3D, Vector2} from 'three';
import { TextComponent, ITextViewerModuleOptionsTextMargin } from '@verybigthings/g.frame.components.text';


export interface IDDArrowSymbolsOptions {
    opened: string;
    closed: string;
}

export interface IDDHeadStyleOptions {
    headerWrap?: Object3D;
    arrowComponent?: TextComponent;
    arrowSymbols?: IDDArrowSymbolsOptions;
    selectedFontSize?: string;
    arrowFontSize?: string;
    bordRadius?: number;
    color?: string;
    bgColor?: string;
    headSideOffset?: number;
    placeholderText?: string;
}

export interface IDDOptionsStyleOptions {
    fontSize?: string;
    height?: number;
    color?: string;
    bgColor?: string;
    margin?: number | ITextViewerModuleOptionsTextMargin;
    disableBorder?: boolean;
    hoverBorderColor?: string;
}

export interface IDropdownComponentOptions {
    size?: Vector2;
    optionList: Array<{body: string, key: string}>;
    defaultSelectedOptionId?: number;
    fontSize?: string;
    headStyle?: IDDHeadStyleOptions;
    optionsStyle?: IDDOptionsStyleOptions;
}