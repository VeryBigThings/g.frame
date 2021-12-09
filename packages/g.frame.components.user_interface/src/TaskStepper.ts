import {Factory, ModulesProcessor, ViewerModule} from '@g.frame/core';
import {ITaskStepperOptions, ITaskTextOptions} from './UIStageManager';
import {Loader, TEXTURE} from '@g.frame/common.loaders';
import {Mesh, MeshBasicMaterial, PlaneGeometry, Texture, Object3D, CircleGeometry, Color, Vector2} from 'three';
import {TextComponent} from "@g.frame/components.text";

const styleConfig = {
    distance: .5,
    connectorThickness: .05,
    iconRadius: 0.25,
    activatedColor: new Color('#4c72d3'),
    deactivatedColor: new Color('#ffffff'),
};

export default class TaskStepper extends ViewerModule {
    public options: ITaskStepperOptions;
    private totalSize: number;
    private icons: Array<Object3D> = [];
    private completedTexture: Texture;
    private activeTextures: Array<Texture>;
    private uncompletedTextures: Array<Texture>;

    constructor(private loader: Loader<any>) {
        super();
        loader.addResources([
            {
                name: 'TASKSTEPPER_completed',
                url: require('../../assets/popups/stepper_completed.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_active_1',
                url: require('../../assets/popups/stepper_active_1.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_active_2',
                url: require('../../assets/popups/stepper_active_2.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_active_3',
                url: require('../../assets/popups/stepper_active_3.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_active_4',
                url: require('../../assets/popups/stepper_active_4.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_active_5',
                url: require('../../assets/popups/stepper_active_5.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_active_6',
                url: require('../../assets/popups/stepper_active_6.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_uncompleted_1',
                url: require('../../assets/popups/stepper_uncompleted_1.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_uncompleted_2',
                url: require('../../assets/popups/stepper_uncompleted_2.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_uncompleted_3',
                url: require('../../assets/popups/stepper_uncompleted_3.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_uncompleted_4',
                url: require('../../assets/popups/stepper_uncompleted_4.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_uncompleted_5',
                url: require('../../assets/popups/stepper_uncompleted_5.png'),
                type: TEXTURE
            },
            {
                name: 'TASKSTEPPER_uncompleted_6',
                url: require('../../assets/popups/stepper_uncompleted_6.png'),
                type: TEXTURE
            },
        ]);

        this.uiObject.name = 'TaskStepper';

    }


    set(newOptions: ITaskStepperOptions) {
        this.options = newOptions;
        this.options.scale = this.options.scale || 1;
        if (this.icons && this.icons[0]) this.icons.forEach(corner => {this.disposeObject(corner)});
        if (!this.completedTexture) this.completedTexture = this.loader.getResource<Texture>('TASKSTEPPER_completed');
        if (!this.activeTextures) this.activeTextures = [
            this.loader.getResource<Texture>('TASKSTEPPER_active_1'),
            this.loader.getResource<Texture>('TASKSTEPPER_active_2'),
            this.loader.getResource<Texture>('TASKSTEPPER_active_3'),
            this.loader.getResource<Texture>('TASKSTEPPER_active_4'),
            this.loader.getResource<Texture>('TASKSTEPPER_active_5'),
            this.loader.getResource<Texture>('TASKSTEPPER_active_6'),
        ];
        if (!this.uncompletedTextures) this.uncompletedTextures = [
            this.loader.getResource<Texture>('TASKSTEPPER_uncompleted_1'),
            this.loader.getResource<Texture>('TASKSTEPPER_uncompleted_2'),
            this.loader.getResource<Texture>('TASKSTEPPER_uncompleted_3'),
            this.loader.getResource<Texture>('TASKSTEPPER_uncompleted_4'),
            this.loader.getResource<Texture>('TASKSTEPPER_uncompleted_5'),
            this.loader.getResource<Texture>('TASKSTEPPER_uncompleted_6'),
        ];

        this.totalSize = styleConfig.iconRadius * this.options.max * this.options.scale + styleConfig.distance * (this.options.max - 1) * this.options.scale;

        for (let i = this.options.current; i > 0; i--) {
            const completedIcon = new Mesh(new CircleGeometry(.25 * this.options.scale, 16), new MeshBasicMaterial({
                map: this.completedTexture,
                transparent: true
            }));
            completedIcon.position.set(this.getIconPosition(i - 1), 0, 0);
            this.addObject(completedIcon);
            this.icons.push(completedIcon);
        }

        if (this.options.max !== this.options.current) {
            const activeIcon = new Mesh(new CircleGeometry(.25 * this.options.scale, 16), new MeshBasicMaterial({
                map: this.activeTextures[this.options.current],
                transparent: true
            }));
            activeIcon.position.set(this.getIconPosition(this.options.current), 0, 0);
            this.addObject(activeIcon);
            this.icons.push(activeIcon);
        }

        if (this.options.max !== this.options.current) for (let i = this.options.max - this.options.current - 1; i > 0; i--) {
            const uncompletedIcon = new Mesh(new CircleGeometry(.25 * this.options.scale, 16), new MeshBasicMaterial({
                map: this.uncompletedTextures[this.options.current + i],
                transparent: true
            }));
            uncompletedIcon.position.set(this.getIconPosition(this.options.current + i), 0, 0.01);
            this.addObject(uncompletedIcon);

            this.icons.push(uncompletedIcon);
        }

        this.addConnectors();
    }

    private getIconPosition(index) {
        return (-this.totalSize / 2 + styleConfig.iconRadius / 2 + (index) * (styleConfig.iconRadius + styleConfig.distance));
    }

    private addConnectors() {
        const maxConnectors = this.options.max - 1;
        const activatedConnectors = this.options.current > maxConnectors ? maxConnectors : this.options.current;
        const deactivatedConnectors = maxConnectors - activatedConnectors;
        for (let i = activatedConnectors; i > 0; i--) {
            const activatedConnector = new Mesh(
                new PlaneGeometry(styleConfig.distance * this.options.scale, styleConfig.connectorThickness * this.options.scale),
                new MeshBasicMaterial({color: styleConfig.activatedColor.getHex()}));
            activatedConnector.position.set(this.getIconPosition(i - 1) + styleConfig.distance / 2 * this.options.scale, 0, -0.01);
            this.addObject(activatedConnector);
            this.icons.push(activatedConnector);
        }
        for (let i = deactivatedConnectors; i > 0; i--) {
            const activatedConnector = new Mesh(
                new PlaneGeometry(styleConfig.distance * this.options.scale, styleConfig.connectorThickness * this.options.scale),
                new MeshBasicMaterial({color: styleConfig.deactivatedColor.getHex()}));
            activatedConnector.position.set(this.getIconPosition(i - 1 + activatedConnectors) + styleConfig.distance / 2 * this.options.scale, 0, -0.01);
            this.addObject(activatedConnector);
            this.icons.push(activatedConnector);
        }
    }
}