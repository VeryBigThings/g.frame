import {GMesh, RoundedPlane, GComponent} from '@verybigthings/g.frame.core';
import {CanvasTexture, ExtrudeGeometry, Geometry, Mesh, MeshBasicMaterial, Vector2} from 'three';
import {ITextGComponentOptions, ITextGComponentOptionsTextStyle} from './TextGComponent_interfaces';

export class TextGComponent extends GComponent {
    public mesh: Mesh;
    public material: MeshBasicMaterial;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private sizePX: Vector2;
    private sizeTHREE: Vector2;
    private neededSize: Vector2;
    private geometry: Geometry;

    constructor(sizePX: Vector2, sizeTHREE: Vector2) {
        super();
        this.sizePX = sizePX;
        this.sizeTHREE = sizeTHREE;

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.sizePX.x;
        this.canvas.height = this.sizePX.y;
    }

    public static generateFontProperty(font: ITextGComponentOptionsTextStyle): string {
        return `${font.style || ''} ${font.weight || ''} ${font.size || ''} ${font.family || ''}`;
    }

    public static getTextStyleSeparated(context: CanvasRenderingContext2D): ITextGComponentOptionsTextStyle {
        const fontValues = (context['fontSaved'] || context.font).split(' ');
        const color = context.fillStyle;
        return {
            color: color,
            family: fontValues[3],
            size: fontValues[2],
            weight: fontValues[1],
            style: fontValues[0]
        };
    }

    /**
     * Function to wrap text on lines
     * @param {CanvasRenderingContext2D} ctx Context of the canvas
     * @param {string} text Text to write
     * @param {number} x Left coordinate of first letter
     * @param {number} y Top coordinate of first letter
     * @param {number} maxWidth Max width in px of each line
     * @param {number} lineHeight Line height in px
     * @param {boolean} wrapOnLines Text should be wrapped on lines
     */
    public static wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, wrapOnLines: boolean) {
        const spaceSymbol = ' ';
        const stylesStack = {
            'color': [],
            'style': [],
            'weight': [],
            'family': [],
            'size': []
        };
        const styleTypeStack = [];
        const words = text.split(' ');
        let line = '';
        y += lineHeight;
        const fillTextColored = (line, _x, y) => {
            let x;
            if (ctx.textAlign === 'left') x = _x;
            if (ctx.textAlign === 'center') x = _x - ctx.measureText(line.split(' ').filter(word => word.indexOf('{{') === -1 && word.indexOf('}}') === -1).join(spaceSymbol)).width / 2;
            if (ctx.textAlign === 'right') x = _x;
            line.split(' ').forEach((word, i, arr) => {
                if (word.indexOf('{{') > -1) {
                    if (word.indexOf('{{/') > -1) {
                        const type = word.replace('{{/', '').replace('}}', '');
                        if (type === 'color') {
                            ctx.fillStyle = stylesStack[type].pop();
                        } else {
                            const currentFont = TextGComponent.getTextStyleSeparated(ctx);
                            currentFont[type] = stylesStack[type].pop();
                            ctx.font = ctx['fontSaved'] = TextGComponent.generateFontProperty(currentFont);
                        }
                    } else {
                        const type = word.replace('{{', '').replace('}}', '').split(':')[0];
                        const value = word.replace('{{', '').replace('}}', '').split(':')[1];
                        const currentFont = TextGComponent.getTextStyleSeparated(ctx);
                        stylesStack[type].push(currentFont[type]);

                        if (type === 'color') {
                            ctx.fillStyle = value;
                        } else {
                            currentFont[type] = value;
                            ctx.font = ctx['fontSaved'] = TextGComponent.generateFontProperty(currentFont);
                        }
                    }
                    return;
                }
                let len = ctx.measureText(word + (i !== arr.length - 1 ? spaceSymbol : '')).width;
                let pos;
                if (ctx.textAlign === 'left') pos = x;
                if (ctx.textAlign === 'center') pos = x + len / 2;
                if (ctx.textAlign === 'right') pos = _x;
                ctx.shadowColor = '' + ctx.fillStyle;
                ctx.shadowBlur = 0.01;

                ctx.fillText(word + (i !== arr.length - 1 ? spaceSymbol : ''), pos, y);
                x += len;
            });
        };
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + (n !== words.length - 1 && words[n + 1] !== '\n' ? spaceSymbol : '');
            const metrics = ctx.measureText(testLine.split(' ').filter(word => word.indexOf('{{') === -1 && word.indexOf('}}') === -1).join(spaceSymbol));
            const testWidth = metrics.width;
            if (((testWidth > maxWidth && n > 0) || words[n] === '\n') && wrapOnLines) {
                fillTextColored(line, x, y);
                if (words[n] !== '\n') {
                    line = words[n] + (n !== words.length - 1 && words[n + 1] !== '\n' ? spaceSymbol : '');
                } else {
                    line = '';
                }
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        fillTextColored(line, x, y);
    }

    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx Context of the canvas
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    public static roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: any | number = 5, fill: boolean = false, stroke: boolean = false) {
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }

    }

    /**
     * Function to draw text, background on canvas and get Mesh with CanvasTexture on it
     * @param {Object} options Options to draw
     * @param {Object} options.text Options to draw text
     *
     * @param {Object|Number} [options.text.margin = 5] Margin of the text
     * @param {Number} [options.text.margin.left = 5] Left margin of the text
     * @param {Number} [options.text.margin.right = 5] Right margin of the text
     * @param {Number} [options.text.margin.top = 5] Top margin of the text
     * @param {Number} [options.text.margin.bottom = 5] Bottom margin of the text
     *
     * @param {String} [options.text.color = '#000'] Color of the text '#000'
     * @param {String} [options.text.font = '32pt Roboto'] Font of the text
     * @param {String} [options.text.align = 'left'] Horizontal of the text. Possible values 'left', 'center' and 'right'
     * @param {Number} [options.text.lineHeight = 40] Line height of the text in pixels
     * @param {Boolean} [options.text.autoWrapping = false] Auto wrapping of the text
     * @param {Boolean} [options.text.autoWrappingHorizontal = false] Auto wrapping of the text in horizontal. Changes width of the plane.
     * @param {String} [options.text.value = 'Default text'] Text
     *
     * @param {Object} options.background Options to draw background
     * @param {Vector2} [options.background.size = size of the canvas] Background size
     * @param {String} [options.background.style = 'solid'] Background style. Possible values 'gradient' and 'solid'
     * @param {String} [options.background.color = '#fff'] Color for solid style.
     * @param {Function} [options.background.gradientFunction] Gradient function to draw gradient.
     * @param {Object} [options.background.border = false] Border properties on the background
     * @param {Number} [options.background.border.width = 10] Border width in pixels
     * @param {String} [options.background.border.color = '#000'] Border color
     * @param {Number} [options.background.radius = 0] Radius of the background. There is no radius on border.
     * @returns {Mesh}
     */
    public updateElement(options: ITextGComponentOptions) {
        // Set arguments to defaults
        options = options || {};
        options.text = options.text || {};
        options.text.margin = options.text.margin || 5;
        const margin = options.text.margin;
        options.text.margin = options.text.margin instanceof Object ? options.text.margin : {};
        options.text.margin.left = options.text.margin.left || (margin instanceof Object ? 0 : margin);
        options.text.margin.right = options.text.margin.right || (margin instanceof Object ? 0 : margin);
        options.text.margin.top = options.text.margin.top || (margin instanceof Object ? 0 : margin);
        options.text.margin.bottom = options.text.margin.bottom || (margin instanceof Object ? 0 : margin);

        options.text.style = options.text.style || {};
        options.text.style.style = options.text.style.style || 'normal';
        options.text.style.weight = options.text.style.weight || '400';
        options.text.style.size = options.text.style.size || '32px';
        options.text.style.family = options.text.style.family || 'Arial';
        options.text.style.color = options.text.style.color || '#000';
        options.text.align = options.text.align || 'left';
        options.text.lineHeight = options.text.lineHeight || 40;
        options.text.autoWrapping = options.text.autoWrapping === undefined ? true : options.text.autoWrapping;
        options.text.autoWrappingHorizontal = options.text.autoWrappingHorizontal === undefined ? false : options.text.autoWrappingHorizontal;
        options.text.value = options.text.value === undefined ? 'Default text' : options.text.value;

        options.background = options.background || {color: '#8fc4e1'};
        options.background.size = options.background.size || this.sizePX.clone();
        options.background.style = options.background.style || 'solid';
        options.background.color = options.background.color || '#fff';
        // options.background.gradientFunction = options.background.gradientFunction || null;
        options.background.border = options.background.border || null;
        if (options.background.border) {
            options.background.border.width = options.background.border.width || 10;
            options.background.border.color = options.background.border.color || '#000';
        }

        options.background.radius = options.background.radius || 0;


        this.neededSize = this.sizePX.clone();

        // while (options.background.size.y > this.sizePX.y) {
        //     this.sizePX.y *= 2;
        //     this.sizeTHREE.y *= 2;
        //     this.canvas.width = this.sizePX.x;
        //     this.canvas.height = this.sizePX.y;
        // }

        if (options.text.autoWrapping) {
            this.context.font = this.context['fontSaved'] = TextGComponent.generateFontProperty(options.text.style);
            this.context.textAlign = options.text.align;
            this.context.fillStyle = options.text.style.color;
            this.calculateWrapping(
                options.text.value.split(' ').filter(word => word.indexOf('{{') === -1 && word.indexOf('}}') === -1).join(' '),
                options.text.align === 'left' ?
                    options.text.margin.left : options.text.align === 'center' ?
                    this.sizePX.x / 2 :
                    this.sizePX.x - options.text.margin.left - options.text.margin.right,
                options.text.margin.top,
                this.sizePX.x - options.text.margin.left - options.text.margin.right,
                options.text.lineHeight,
                options.text.margin.bottom,
                !options.text.autoWrappingHorizontal
            );
        }

        if (options.text.autoWrappingHorizontal) {
            this.context.font = this.context['fontSaved'] = TextGComponent.generateFontProperty(options.text.style);
            this.context.textAlign = options.text.align;
            this.context.fillStyle = options.text.style.color;
            const metrics = this.context.measureText(options.text.value.split(' ').filter(word => word.indexOf('{{') === -1 && word.indexOf('}}') === -1).join(' '));
            let needSizeX = metrics.width + options.text.margin.left + options.text.margin.right;
            if (needSizeX === 0) needSizeX = 1;
            this.sizeTHREE.x *= needSizeX / this.sizePX.x;
            this.neededSize.x = needSizeX;
            this.canvas.width = this.neededSize.x;
            this.sizePX.x = this.neededSize.x;
        } else {
            this.neededSize.x = this.sizePX.x;
            this.canvas.width = this.sizePX.x;
        }

        // console.log(this.neededSize.x, this.sizePX.x, this.canvas.width, this.neededSize.y, this.sizePX.y, this.canvas.height);


        if (options.background.style === 'solid') {
            this.context.fillStyle = options.background.color;
        } else if (options.background.style === 'gradient') {
            this.context.fillStyle = 'rgba(255, 255, 255, 0)';
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let grd;
            // if (options.background.gradientFunction) {
            //     grd = options.background.gradientFunction(this.context, options.background.size);
            //     this.context.fillStyle = grd;
            //     this.context.strokeStyle = '';
            // }
        }

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);


        if (options.background.border) {
            this.context.globalCompositeOperation = 'source-over';
            this.context.lineWidth = options.background.border.width;
            this.context.fillStyle = options.background.color;
            this.context.strokeStyle = options.background.border.color;
            this.context.strokeRect(0, 0, this.neededSize.x || this.sizePX.x || this.canvas.width, this.neededSize.y || this.sizePX.y || this.canvas.height);
            // console.log(this.neededSize.x, this.sizePX.x, this.canvas.width, this.neededSize.y, this.sizePX.y, this.canvas.height);
        }

        this.context.font = this.context['fontSaved'] = TextGComponent.generateFontProperty(options.text.style);
        this.context.textAlign = options.text.align;
        this.context.fillStyle = options.text.style.color;
        TextGComponent.wrapText(
            this.context,
            options.text.value,
            options.text.align === 'left' ?
                options.text.margin.left : options.text.align === 'center' ?
                (this.neededSize.x || this.sizePX.x) / 2 :
                (this.neededSize.x || this.sizePX.x) - options.text.margin.right,
            options.text.margin.top,
            (this.neededSize.x || this.sizePX.x) - options.text.margin.left - options.text.margin.right,
            options.text.lineHeight,
            !options.text.autoWrappingHorizontal
        );

        if (!this.mesh) {
            const texture = new CanvasTexture(this.canvas);
            // texture.minFilter = NearestFilter;
            // texture.magFilter = NearestFilter;
            // texture.anisotropy = 2;
            const isTransparentTrue = options.background.color.includes('rgba') || options.background.color.includes('transparent') || (options.text.style && (<string>options.text.style.color).includes('rgba')) || (options.text.style && (<string>options.text.style.color).includes('transparent'));
            this.material = new MeshBasicMaterial({color: 0xffffff, map: texture, transparent: isTransparentTrue});
            const roundedBoxOptions = {
                width: this.sizeTHREE.x,
                height: this.sizeTHREE.y,
                depth: 0,
                r1: options.background.radius,
            };

            this.geometry = RoundedPlane.getRoundedBoxGeometry(roundedBoxOptions);

            this.mesh = new GMesh<ExtrudeGeometry, MeshBasicMaterial>(this.geometry, this.material);
            this.addObject(this.mesh, {geometry: true, material: true, maps: true, actions: true, viewer: true});
        }
        if ((options.background.size.lengthSq() || options.text.autoWrapping || options.text.autoWrappingHorizontal) && this.geometry) {
            const needsSizeTHREE = new Vector2(this.sizeTHREE.x * (this.neededSize.x / this.sizePX.x), this.sizeTHREE.y * (this.neededSize.y / this.sizePX.y));
            this.geometry.dispose();
            const roundedBoxOptions = {
                width: needsSizeTHREE.x,
                height: needsSizeTHREE.y,
                depth: 0,
                r1: options.background.radius,
            };

            this.geometry = RoundedPlane.getRoundedBoxGeometry(roundedBoxOptions);
            this.geometry.computeBoundingBox();
            this.mesh.geometry = this.geometry;
        }
        (<MeshBasicMaterial>this.mesh.material).map.needsUpdate = true;
        return this.mesh;
    }


    /**
     * Function to calculate wrapping text and scale canvas in Y dimension
     * @param {string} text Text to write
     * @param {number} x Left coordinate of first letter
     * @param {number} y Top coordinate of first letter
     * @param {number} maxWidth Max width in px of each line
     * @param {number} lineHeight Line height in px
     * @param {number} marginBottom Margin bottom in px
     * @param {boolean} wrapOnLines Text should be wrapped on lines
     */
    private calculateWrapping(text: string, x: number, y: number, maxWidth: number, lineHeight: number, marginBottom: number, wrapOnLines: boolean) {
        let lines = 0,
            line = '';
        const words = text.split(' ');
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ',
                metrics = this.context.measureText(testLine),
                testWidth = metrics.width;
            if (((testWidth > maxWidth && n > 0) || words[n] === '\n') && wrapOnLines) {
                lines++;
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines++;
        let neededSize = (lines * lineHeight) + y + marginBottom;
        if (neededSize === 0) neededSize = 1;
        this.sizeTHREE.y *= neededSize / this.sizePX.y;
        this.canvas.height = neededSize;
        this.sizePX.y = neededSize;
        this.neededSize.y = neededSize;
        //
        // if (this.sizePX.y < neededSize) {
        //     this.sizePX.y *= 2;
        //     this.sizeTHREE.y *= 2;
        //     this.calculateWrapping(text, x, y, maxWidth, lineHeight, marginBottom, wrapOnLines);
        // } else {
        //     this.canvas.height = this.sizePX.y;
        //     this.neededSize.y = neededSize;
        // }
    }
}
