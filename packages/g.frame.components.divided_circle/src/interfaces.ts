import {Object3D} from 'three';
import {ViewerModule} from '@g.frame/core';
import {IDepthScrollComponentOptions} from '@g.frame/components.depth_scroll';
import {ITextViewerModuleOptionsText} from '@g.frame/components.text';
import {ButtonComponent} from '@g.frame/components.buttons';

export interface ISectorItem {
    name: string;
    mesh: Object3D | ViewerModule;
}

export interface IPrimarySectorProps {
    innerRadius?: number;
    outerRadius?: number;
    sectorColors?: ISectorColors;
    startAngle?: number;
    fullAngleLength?: number;
}

export interface ISectorColors {
    default?: number;
    hover?: number;
    click?: number;
}

export interface ISectorOptions extends IPrimarySectorProps {
    borderWidth?: number;
    bgColor?: number;
    numbCurrSector: number;
    totalSectors: number;
    sectorData?: ISectorItem;
    enableSector: boolean;
}


export interface IDividedCircleMenu extends IPrimarySectorProps {
    allowMouseEvents?: boolean;
    highlightText?: string;
    borderWidth?: number;
    borderColor?: number;
    bgColor?: number;
    enableSector?: boolean;
    enableBackground?: boolean;
    enableCancelButton?: boolean;
    sectorsData: Array<ISectorItem>;
    centerText?: ITextViewerModuleOptionsText;
    cancelButton?: ButtonComponent;
    enableSectorAfterClick?: boolean;
}

export interface ICirclePreloader extends IPrimarySectorProps {
    totalSectors?: number;
}


export interface IMultipleCircleMenuComponent extends IDepthScrollComponentOptions {
    menus: Array<IDividedCircleMenu | { (sectorDara: Array<ISectorItem>): IDividedCircleMenu }>;
}
