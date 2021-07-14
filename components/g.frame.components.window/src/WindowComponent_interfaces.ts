import {Texture, Vector2} from 'three';

export interface WindowComponentOptions {
    size: Vector2;

    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    spaceBetweenObjects?: number;

    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;

    background?: number;
    backgroundTexture?: Texture;

    bordWidth?: number;
    bordColor?: number;
    bordRadius?: number;
}