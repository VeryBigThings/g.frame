import {GframeModule} from '@g.frame/core';
import {Vector3} from 'three';
import {IDepthScrollComponentOptions} from './DepthScrollComponent_interfaces';

export class DepthScrollComponent extends GframeModule {
    private layers: Array<GframeModule>;
    private options: IDepthScrollComponentOptions;

    constructor(options: IDepthScrollComponentOptions) {
        super();
        this.layers = [];
        this.options = options;
    }

    public addLayer(component: GframeModule, orderNumber?: number) {
        this.addObject(component);
        if (orderNumber === null) this.layers.push(component);
        else this.layers.splice(orderNumber, 0, component);
        this.scroll(this.layers.length === 1 ? null : 0);
    }

    public removeLayer(component: GframeModule) {
        this.removeObject(component);
        this.layers.splice(this.layers.indexOf(component), 1);
        component.dispose();
        this.reorderLayers();
    }

    public getActiveLayer() {
        return this.layers[0];
    }

    private scroll(scrollSize: number = null) {
        if (scrollSize !== null) scrollSize = scrollSize < 0 ? this.layers.length + scrollSize : scrollSize;
        const layersOld = this.layers.slice();
        this.layers.length = 0;
        if (scrollSize !== null) {
            const temp = [];
            layersOld.forEach((layer, i) => {
                if (i < scrollSize) {
                    temp.push(layer);
                } else {
                    this.layers.push(layer);

                }
            });
            this.layers = this.layers.concat(temp);
        } else this.layers = layersOld;
        this.layers.forEach((layer, i) => this.animateLayer(layer, i, scrollSize === null));
    }

    private reorderLayers() {
        this.scroll(null);
    }

    private animateLayer(component: GframeModule, newIndex: number, withoutTime: boolean = false) {
        if (withoutTime) {
            component.uiObject.position.copy(this.getLayerPosition(newIndex));
        } else {
            let tween = new TWEEN.Tween(component.uiObject.position)
                .to(this.getLayerPosition(newIndex), 500)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate((delta) => {
                })
                .onComplete(() => {
                });
            tween.start();

        }
    }

    private getLayerPosition(index: number): Vector3 {
        return new Vector3(0, index * this.options.yMargin, -index * this.options.zMargin);
    }
}
