import {DividedCircleComponent, Sector} from './DividedCircleComponent';
import {TextComponent} from '@verybigthings/g.frame.components.text';
import {Vector2} from 'three';
import {ICirclePreloader} from './interfaces';
import {ActionController} from '@verybigthings/g.frame.common.action_controller';


export class CirclePreloaderComponent extends DividedCircleComponent {
    private animateSector: Sector;

    constructor(options: ICirclePreloader, actionController: ActionController) {
        super({
            innerRadius: options.innerRadius,
            outerRadius: options.outerRadius,
            sectorColors: options.sectorColors,
            borderWidth: 0.04,
            allowMouseEvents: false,
            enableBackground: false,
            sectorsData: new Array(options.totalSectors),
        }, actionController);

        const preloaderText = new TextComponent({
            size: new Vector2(12, 2),
            pxSize: new Vector2(1024, 512 / 3),
            text: {
                style: {size: '60px'},
                lineHeight: 62,
                margin: 15,
                autoWrappingHorizontal: true,
                autoWrapping: true,
                value: 'Experience is warming up...',
            },
            background: {
                color: '#0f6cfb',
            }
        });
        preloaderText.uiObject.position.set(0, -options.outerRadius - 1, 0);
        this.addObject(preloaderText);
        this.setEnable(true);
    }

    private _enabled: boolean;

    get enabled(): boolean {
        return this._enabled;
    }

    setNextActive(sector: Sector) {
        this.setActive(sector)
            .then(sector => {
                if (this._enabled) {
                    let indexActiveSector = this.sectors.indexOf(<Sector>sector) - 1;
                    if (indexActiveSector < 0) indexActiveSector = this.sectors.length - 1;

                    this.animateSector = this.sectors[indexActiveSector];

                    this.setActive(<Sector>sector, false, 130);
                    this.setNextActive(this.animateSector);
                }
            });
    }

    setEnable(enable: boolean = true) {
        if (enable) {
            if (this._enabled) this.setEnable(false);
            this.setNextActive(this.sectors[this.sectors.length - 1]);
        } else
            this.setActive(this.animateSector, false, 130);

        this._enabled = enable;
    }
}

