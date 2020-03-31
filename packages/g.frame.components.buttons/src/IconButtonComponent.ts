import {Group, Mesh, Vector2, Vector3} from 'three';
import {ButtonComponent} from './ButtonComponent';
import {IIconButtonComponentOptions} from './IconButtonComponent_interfaces';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';

export class IconButtonComponent extends ButtonComponent {
    protected box: Mesh;
    protected group: Group;

    constructor(options: IIconButtonComponentOptions, actionController: ActionController) {
        options.pxRatio = options.pxRatio || 6;
        options.iconSize = Math.max(Math.min(options.iconSize || 1, 1), 0);
        options.differenceBetweenSizeAndLineHeight = options.differenceBetweenSizeAndLineHeight || 4;
        super({
            size: new Vector3(options.diameter, options.diameter, 0.1),
            sizePx: new Vector2(40 * options.pxRatio, 40 * options.pxRatio),
            type: 'icon',
            text: {
                value: options.text,
                lineHeight: (28 - options.differenceBetweenSizeAndLineHeight) * options.pxRatio * options.iconSize,
                align: 'center',
                style: {
                    color: options.textColor || 'white',
                    family: 'FontAwesome',
                    size: 28 * options.pxRatio * options.iconSize + 'px', // 28 = 40 / (2^0.5)
                    weight: options.weight || '400',
                },
                autoWrapping: false,
                autoWrappingHorizontal: false,
                margin: 6 * options.pxRatio + (28 * options.pxRatio * (1 - options.iconSize) * 0.5)// 6 = (40 - 40 / (2^0.5)) / 2
            },
            background: {
                color: options.background || 'black'
            }
        }, actionController);
    }
}
