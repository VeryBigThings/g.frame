import {RepeatWrapping, Texture} from 'three';

export interface ITextureAnimatorOptions {
    texture?: Texture;
    horizontal?: number;
    vertical?: number;
    total?: number;
    duration?: number;
    repeat?: number;
}

export class TextureAnimator {
    public duration: number;
    private texture: Texture;
    private horizontal: number;
    private vertical: number;
    private currentTile: number;
    private tiles: number;
    private started: boolean;
    private startTime: number;
    private totalTiles: number;
    private repeat: number;
    private repeatedTimes: number;
    private currentDisplayTime: number;
    private callback: Function;

    constructor(private options: ITextureAnimatorOptions) {
        this.texture = options.texture;
        this.options.horizontal = this.horizontal = Math.abs(options.horizontal) || 1;
        this.options.vertical = this.vertical = Math.abs(options.vertical) || 1;
        this.options.total = this.totalTiles = Math.abs(options.total) || this.horizontal * this.vertical;

        // How long should each image be displayed?
        this.options.duration = this.duration = options.duration || 30;
        this.options.repeat = this.repeat = options.repeat || Infinity;

        this.texture.wrapS = this.texture.wrapT = RepeatWrapping;
        this.texture.repeat.set(1 / this.horizontal, 1 / this.vertical);

        this.currentTile = 0;
        this.tiles = 0;
        this.startTime = 0;
    }

    private _enabled: boolean;

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(newValue: boolean) {
        this._enabled = newValue;
        if (newValue) {
            this.started = true;
            this.repeatedTimes = 0;

        } else this.tiles = 0;

    }

    changeDuration(newDuration?: number) {
        this.duration = newDuration || this.options.duration;
        this.options.duration = this.duration;

        this.currentTile = 0;
        this.tiles = 0;
        this.enabled = true;
        // this.start();
    }

    changeTile(newTile: number) {
        this.currentTile = newTile >= this.totalTiles ? 0 : newTile;
        this.updateTile();
        this.enabled = false;
    }

    update(time: number) {
        if (!this._enabled) return;

        if (this.started) {
            this.startTime = time;
            this.started = false;
        }

        const currentDisplayTime = time - this.startTime;
        const coef = currentDisplayTime / this.duration - this.tiles;

        if (coef > 1) {
            this.tiles++;
            this.updateTile();
            if (++this.currentTile === this.totalTiles) {
                this.currentTile = 0;
                if (++this.repeatedTimes >= this.repeat)
                    return this.enabled = false;
            }
        }
    }

    start() {
        this.started = false;
    }

    private updateTile() {
        const currentColumn = this.currentTile % this.horizontal;
        this.texture.offset.x =  currentColumn / this.horizontal;
        const currentRow = this.vertical - Math.floor(this.currentTile / this.horizontal);
        this.texture.offset.y = currentRow / this.vertical;
    }

}