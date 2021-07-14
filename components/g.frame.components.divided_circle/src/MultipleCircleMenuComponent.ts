import {ParentEvent, ViewerModule} from '@g.frame/core';
import {Mesh, Vector2, Vector3, Object3D} from 'three';
import {DividedCircleComponent} from './DividedCircleComponent';
import {ButtonComponent} from '@g.frame/components.buttons';
import {DepthScrollComponent, IDepthScrollComponentOptions} from '@g.frame/components.depth_scroll';
import {IDividedCircleMenu, IMultipleCircleMenuComponent, ISectorItem} from './interfaces';
import {ActionController} from '@g.frame/common.action_controller';


export class MultipleCircleMenuComponent extends ViewerModule {
    public uiObject: Mesh;
    private _indexDispMenu: number = -1;
    private depthScrollComponent: DepthScrollComponent;
    private circleMenuList: Array<DividedCircleComponent> = [];
    private options: IMultipleCircleMenuComponent;
    private selectedSectorItems: Array<ISectorItem> = [];
    private backBtn: ButtonComponent;

    constructor(options: IMultipleCircleMenuComponent, private actionController: ActionController) {
        super();

        this.options = options;
        this.depthScrollComponent = new DepthScrollComponent(<IDepthScrollComponentOptions>options);

        this.depthScrollComponent.uiObject.position.set(0, 0, 0);
        this.addObject(this.depthScrollComponent);

        this.initBackBtn();
        this.initNextCircleMenu(null);
    }

    initBackBtn() {
        const innerRadiusList = this.options.menus.map(sectorData => (<IDividedCircleMenu>sectorData).innerRadius);
        const outerRadiusList = this.options.menus.map(sectorData => (<IDividedCircleMenu>sectorData).outerRadius);
        const borderWidthList = this.options.menus.map(sectorData => (<IDividedCircleMenu>sectorData).borderWidth);
        const minInnerRadius = Math.min(...innerRadiusList.filter(Boolean));
        const maxOuterRadius = Math.max(...outerRadiusList.filter(Boolean));
        const maxBorderWidth = Math.max(...borderWidthList.filter(Boolean));

        this.backBtn = new ButtonComponent({
            type: '3dIconEmpty',
            sizePx: new Vector2(128, 128),
            size: new Vector3(minInnerRadius * 0.7, minInnerRadius * 0.7, 1),
            bordRadius: maxBorderWidth,
            text: {value: ''}
        }, this.actionController);
        this.addObject(this.backBtn);
        this.backBtn.uiObject.position.set(-maxOuterRadius, maxOuterRadius, -1);
        this.backBtn.on('click', () => {
            if (this._indexDispMenu > 0) {
                this.selectedSectorItems.splice(this.selectedSectorItems.length - 1, 1);
                const removedDepthScrollComponent = this.depthScrollComponent.getActiveLayer();
                this.depthScrollComponent.removeLayer(removedDepthScrollComponent);
                removedDepthScrollComponent.dispose();
                this._indexDispMenu--;
                this.circleMenuList[this._indexDispMenu].enableMouseEvents(true);
                this.circleMenuList[this._indexDispMenu].sectorsMeshShow = true;
            } else {
                this.fire('canceled', new ParentEvent<string>('canceled'));
            }
        });
    }

    enableMenu() {
        this.uiObject.visible = true;
        this.setDefaultState();
    }

    disableMenu() {
        this.uiObject.visible = false;
    }

    setDefaultState() {
        for (let i = 0; i <= this._indexDispMenu; i++) {
            this.depthScrollComponent.removeLayer(this.circleMenuList[i]);
        }

        this.selectedSectorItems = [];
        this._indexDispMenu = 0;

        let circleCompData = {...(<IDividedCircleMenu>this.options.menus[this._indexDispMenu])};

        this.circleMenuList[this._indexDispMenu] = new DividedCircleComponent({
            sectorsData: circleCompData.sectorsData,
            innerRadius: circleCompData.innerRadius,
            outerRadius: circleCompData.outerRadius,
            allowMouseEvents: true,
            borderWidth: 0.01,
        }, this.actionController);

        this.circleMenuList[this._indexDispMenu].sectorsMeshShow = true;
        this.circleMenuList[this._indexDispMenu].on('selected', (event) => this.setNextCircleMenu(event.data.sectorData));
        this.depthScrollComponent.addLayer(this.circleMenuList[this._indexDispMenu]);
    }

    setNextCircleMenu(sectorData: ISectorItem) {
        this.selectedSectorItems.push(sectorData);

        for (let i = 0; i <= this._indexDispMenu; i++) {
            this.circleMenuList[i].enableMouseEvents(false);
            this.circleMenuList[i].sectorsMeshShow = false;
        }

        if (this.options.menus[this._indexDispMenu + 1]) {
            this._indexDispMenu++;
            // potentially menus array can have elements of different types
            const circleCompData = (<Function>this.options.menus[this._indexDispMenu])(this.selectedSectorItems);

            if (circleCompData.selected) {
                this.fire('selected', new ParentEvent<string>('selected', this.selectedSectorItems.filter(Boolean)));
            }

            this.circleMenuList[this._indexDispMenu] = new DividedCircleComponent({
                sectorsData: circleCompData.sectorsData,
                innerRadius: circleCompData.innerRadius,
                outerRadius: circleCompData.outerRadius,
                allowMouseEvents: true,
                borderWidth: 0.01,
            }, this.actionController);

            this.circleMenuList[this._indexDispMenu].on('selected', (event) => this.setNextCircleMenu(event.data.sectorData));

            this.depthScrollComponent.addLayer(this.circleMenuList[this._indexDispMenu]);
        } else {
            this.fire('selected', new ParentEvent<string>('selected', this.selectedSectorItems.filter(Boolean)));
        }
    }

    initNextCircleMenu(sectorData: ISectorItem) {
        this.selectedSectorItems.push(sectorData);

        if (this._indexDispMenu !== -1) {
            this.circleMenuList[this._indexDispMenu].enableMouseEvents(false);
            this.circleMenuList[this._indexDispMenu].sectorsMeshShow = false;
        }

        if (this.options.menus.length - 2 >= this._indexDispMenu) {
            this._indexDispMenu++;

            let circleCompData = {...(<IDividedCircleMenu>this.options.menus[this._indexDispMenu])};

            if (this.options.menus[this._indexDispMenu] instanceof Function) {
                circleCompData = (<Function>this.options.menus[this._indexDispMenu])(this.selectedSectorItems);
            }

            this.circleMenuList[this._indexDispMenu] = new DividedCircleComponent({
                sectorsData: circleCompData.sectorsData,
                innerRadius: circleCompData.innerRadius,
                outerRadius: circleCompData.outerRadius,
                allowMouseEvents: circleCompData.allowMouseEvents,
                enableBackground: circleCompData.enableBackground,
                borderWidth: circleCompData.borderWidth,
                highlightText: circleCompData.highlightText,
                enableSector: circleCompData.enableSector,
                enableCancelButton: false
            }, this.actionController);
            this.circleMenuList[this._indexDispMenu].sectorsMeshShow = true;
            this.circleMenuList[this._indexDispMenu].on('selected', (event) => this.initNextCircleMenu(event.data.sectorData));
            this.depthScrollComponent.addLayer(this.circleMenuList[this._indexDispMenu]);
        } else {
            this.fire('selected', new ParentEvent<string>('selected', this.selectedSectorItems.filter(Boolean)));
        }
    }

    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }
}
