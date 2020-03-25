import {
    Box3,
    CircleGeometry,
    Color,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Shape,
    ShapeGeometry,
    Sphere,
    Vector2,
    Vector3
} from 'three';
import {ActionController, ActionControllerEventName, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {TextComponent} from '@verybigthings/g.frame.components.text';
import {ButtonComponent, IconButtonComponent} from '@verybigthings/g.frame.components.buttons';
import {IDividedCircleMenu, ISectorItem, ISectorOptions} from './interfaces';


export class Sector extends ViewerModule {
    public sector: Mesh;
    public numbCurrSector: number;
    public color: number;
    public activeColor: number;
    public sectorData: any;
    public outerAngleSpace: number;
    private innerRadius: number;
    private enableSector: boolean;
    private outerRadius: number;
    private totalSectors: number;
    private shape: Shape;
    private borderShape: Shape;
    private borderMesh: Mesh;
    private mesh: any;
    private angleRad: number;
    private borderWidth: number;
    private angleSector: number;
    private innerAngleSpace: number;
    private TOTAL_CIRCLE_SEGMENTS: number = 72;
    private ANGLE_SPACE: number = 5;
    private options: ISectorOptions;

    constructor(options: ISectorOptions) {
        super();

        this.options = options;
        this.innerRadius = options.innerRadius;
        this.outerRadius = options.outerRadius;
        this.numbCurrSector = options.numbCurrSector;
        this.totalSectors = options.totalSectors;
        this.borderWidth = options.borderWidth;
        this.angleSector = (2 * Math.PI) / this.totalSectors;
        this.enableSector = options.enableSector;

        this.innerAngleSpace = this.ANGLE_SPACE * Math.PI / 180;
        this.outerAngleSpace = this.innerAngleSpace * options.innerRadius / options.outerRadius;

        this.color = 0x4023a3;
        this.activeColor = 0xf15573;

        if (options.sectorColors) {
            this.color = options.sectorColors.default;
            this.activeColor = options.sectorColors.hover;
        }

        this.initShape();

        this.sector = new Mesh(
            new ShapeGeometry(this.shape),
            new MeshBasicMaterial({color: this.color, side: DoubleSide, visible: options.enableSector})
        );


        // CALC POS AND TURN MESH ======
        const angleStep = 180 / this.totalSectors * Math.PI / 180;
        this.angleRad = (Math.PI * 2) / this.totalSectors * options.numbCurrSector + angleStep;

        if (options.sectorData) {
            this.sectorData = options.sectorData;
            this.mesh = options.sectorData.mesh;
            this.addSectorMesh();
        }
        this.addObject(this.sector);
        if (options.enableSector) {
            if (options.borderWidth) {
                this.initShapeBorder();
                this.borderMesh = new Mesh(
                    new ShapeGeometry(this.borderShape),
                    new MeshBasicMaterial({color: 0x000000, side: DoubleSide})
                );
                this.borderMesh.position.z -= 0.002;
                this.addObject(this.borderMesh);
            }
        }
    }

    private _meshShow: boolean;

    get meshShow(): boolean {
        return this._meshShow;
    }

    set meshShow(isShowed: boolean) {
        const sectorMesh = this.mesh.uiObject ? this.mesh.uiObject : this.mesh;
        sectorMesh.visible = isShowed;
        this._meshShow = isShowed;
    }

    private _active: boolean;

    get active(): boolean {
        return this._active;
    }

    set active(active: boolean) {
        this._active = active;
    }

    addSectorMesh() {
        const middle_R = this.innerRadius + (this.outerRadius - this.innerRadius) / 2;

        this.sector.userData.center = new Vector2();
        this.sector.userData.center.x = middle_R * Math.cos(this.angleRad);
        this.sector.userData.center.y = middle_R * Math.sin(this.angleRad);

        let sectorMesh = this.mesh.position ? this.mesh : this.mesh.uiObject;
        sectorMesh.position.set(this.sector.userData.center.x, this.sector.userData.center.y, sectorMesh.userData.isScaled ? sectorMesh.position.z : 0.01);

        // COMPUTE COEF AND SCALE SECTOR'S MESH ==========
        if (!sectorMesh.userData.isScaled) {
            sectorMesh.updateMatrixWorld(true);
            const b3 = new Box3();
            b3.setFromObject(sectorMesh);
            const sphereMesh = b3.getBoundingSphere(new Sphere());
            const sizeDiff = ((this.outerRadius - this.innerRadius) / 2) / sphereMesh.radius;
            sectorMesh.scale.set(sizeDiff, sizeDiff, sizeDiff);
            sectorMesh.position.z += b3.getSize(new Vector3()).z * sizeDiff;
            sectorMesh.userData.isScaled = true;
        }
        this.addObject(sectorMesh);
        this.uiObject.remove(sectorMesh);
        this.sector.add(sectorMesh);
    }

    initShapeBorder() {
        this.borderShape = new Shape();
        const segmentsPerSector = this.TOTAL_CIRCLE_SEGMENTS / this.totalSectors;
        const angleSector = (2 * Math.PI - this.totalSectors * this.innerAngleSpace) / this.totalSectors;
        const angleSectorOuter = (2 * Math.PI - this.totalSectors * this.outerAngleSpace) / this.totalSectors;
        const angleSegment = angleSector / segmentsPerSector;
        const angleSegmentOuter = angleSectorOuter / segmentsPerSector;
        const startAngle = this.numbCurrSector * (angleSector + this.innerAngleSpace);


        // OUTER CIRCLE
        const outerStartAngle = this.numbCurrSector * (angleSectorOuter + this.outerAngleSpace);

        const circleOuterPointList = [];

        for (let i = 0; i <= segmentsPerSector; i++) {
            const x = this.outerRadius * Math.cos(outerStartAngle + (i * angleSegmentOuter));
            const y = this.outerRadius * Math.sin(outerStartAngle + (i * angleSegmentOuter));

            circleOuterPointList.push(new Vector2(x, y));
        }


        // INNER CIRCLE
        const circleInnerPointList = [];

        for (let i = 0; i <= segmentsPerSector; i++) {
            const x = this.innerRadius * Math.cos(startAngle + (i * angleSegment));
            const y = this.innerRadius * Math.sin(startAngle + (i * angleSegment));

            circleInnerPointList.push(new Vector2(x, y));
        }


        this.borderShape.moveTo(circleInnerPointList[0].x, circleInnerPointList[0].y);

        circleInnerPointList.reverse();

        circleOuterPointList.forEach(point => this.borderShape.lineTo(point.x, point.y));
        circleInnerPointList.forEach(point => this.borderShape.lineTo(point.x, point.y));
    }

    initShape() {
        this.shape = new Shape();
        const innerBorderAngle = (this.borderWidth / (this.innerRadius + this.borderWidth));
        const outerBorderAngle = (this.borderWidth / (this.outerRadius - this.borderWidth));
        const segmentsPerSector = this.TOTAL_CIRCLE_SEGMENTS / this.totalSectors;
        const angleSector = (2 * Math.PI - this.totalSectors * (this.innerAngleSpace + innerBorderAngle * 2)) / this.totalSectors;
        const angleSectorOuter = (2 * Math.PI - this.totalSectors * (this.outerAngleSpace + outerBorderAngle * 2)) / this.totalSectors;
        const angleSegment = angleSector / segmentsPerSector;
        const angleSegmentOuter = angleSectorOuter / segmentsPerSector;
        const startAngle = innerBorderAngle + this.numbCurrSector * (angleSector + this.innerAngleSpace + 2 * innerBorderAngle);


        // OUTER CIRCLE
        const outerStartAngle = outerBorderAngle + this.numbCurrSector * (angleSectorOuter + this.outerAngleSpace + 2 * outerBorderAngle);

        const circleOuterPointList = [];

        for (let i = 0; i <= segmentsPerSector; i++) {
            const x = (this.outerRadius - this.borderWidth) * Math.cos(outerStartAngle + (i * angleSegmentOuter));
            const y = (this.outerRadius - this.borderWidth) * Math.sin(outerStartAngle + (i * angleSegmentOuter));

            circleOuterPointList.push(new Vector2(x, y));
        }


        // INNER CIRCLE
        const circleInnerPointList = [];

        for (let i = 0; i <= segmentsPerSector; i++) {
            const x = (this.innerRadius + this.borderWidth) * Math.cos(startAngle + (i * angleSegment));
            const y = (this.innerRadius + this.borderWidth) * Math.sin(startAngle + (i * angleSegment));

            circleInnerPointList.push(new Vector2(x, y));
        }


        this.shape.moveTo(circleInnerPointList[0].x, circleInnerPointList[0].y);

        circleInnerPointList.reverse();

        circleOuterPointList.forEach(point => this.shape.lineTo(point.x, point.y));
        circleInnerPointList.forEach(point => this.shape.lineTo(point.x, point.y));
    }

    selected() {

    }
}


export class DividedCircleComponent extends ViewerModule {
    public innerRadius: number;
    public outerRadius: number;
    public sectors: Array<Sector> = [];
    public sectorsData: Array<ISectorItem>;
    public allowMouseEvents: boolean;
    public highlightText: string;
    public borderWidth: number;
    public cancelButton: ButtonComponent;
    public options: IDividedCircleMenu;
    private backgroundBorder: Mesh;
    private tooltipEnabled: boolean;
    private tooltipPanel: TextComponent;
    private enableSector: boolean;
    private enableBackground: boolean;
    private enableCancelButton: boolean;


    constructor(options: IDividedCircleMenu, private actionController: ActionController) {
        super();

        this.options = options;
        this.enableCancelButton = options.enableCancelButton === undefined ? false : options.enableCancelButton;
        this.enableBackground = options.enableBackground === undefined ? true : options.enableBackground;
        this.innerRadius = options.innerRadius ? options.innerRadius : 4;
        this.outerRadius = options.outerRadius ? options.outerRadius : 9;
        this.sectorsData = options.sectorsData;
        this.allowMouseEvents = options.allowMouseEvents ? options.allowMouseEvents : true;
        this.highlightText = options.highlightText;
        this.tooltipEnabled = false;
        this.enableSector = options.enableSector;
        this.highlightText = options.highlightText ? options.highlightText : '';
        this.borderWidth = options.borderWidth ? options.borderWidth : 0;
        options.borderColor = options.borderColor ? options.borderColor : 0x000000;

        if (this.enableCancelButton) {
            if (options.cancelButton) this.cancelButton = options.cancelButton;
            else {
                this.cancelButton = new IconButtonComponent({
                    text: '',
                    background: new Color(this.options.sectorColors.default).getStyle(),
                    textColor: 'white',
                    iconSize: 0.6,
                    diameter: this.innerRadius * 0.7
                }, this.actionController);
            }
            this.addObject(this.cancelButton);
            this.cancelButton.uiObject.position.set(-this.outerRadius, this.outerRadius, 0);
            this.cancelButton.on('click', () => {
                this.uiObject.visible = false;
                this.fire('canceled');
            });
        }

        for (let currIndex = 0; currIndex < this.sectorsData.length; currIndex++) {
            const newSector = new Sector({
                innerRadius: this.innerRadius,
                outerRadius: this.outerRadius,
                numbCurrSector: currIndex,
                totalSectors: this.sectorsData.length,
                sectorData: this.sectorsData[currIndex],
                borderWidth: this.borderWidth,
                enableSector: this.enableSector,
                sectorColors: options.sectorColors,
            });
            if (this.enableBackground) {
                if (currIndex === 0) {
                    const backgroundBorderWidth = this.outerRadius + (newSector.outerAngleSpace * this.outerRadius + options.borderWidth);
                    const backgroundBorderBlackWidth = this.outerRadius + this.borderWidth * 2 + (newSector.outerAngleSpace * this.outerRadius);
                    this.backgroundBorder = new Mesh(
                        new CircleGeometry(backgroundBorderWidth, 72),
                        new MeshBasicMaterial({color: options.bgColor})
                    );
                    const backgroundBorderBlack = new Mesh(new CircleGeometry(backgroundBorderBlackWidth, 72), new MeshBasicMaterial({color: options.borderColor}));
                    this.backgroundBorder.translateZ(-0.003);
                    backgroundBorderBlack.translateZ(-0.005);
                    this.addObject(this.backgroundBorder);
                    if (this.borderWidth) this.addObject(backgroundBorderBlack);
                }
            }
            this.initEvents(newSector);

            this.sectors.push(newSector);
        }

        this.sectors.forEach(sector => this.addObject(sector));

        if (this.highlightText !== '') {
            this.tooltipEnabled = true;
            this.initTooltip(this.innerRadius);
        }
    }

    private _sectorsMeshShow: boolean;

    get sectorsMeshShow(): boolean {
        return this._sectorsMeshShow;
    }

    set sectorsMeshShow(isShowed: boolean) {
        this.sectors.forEach(sector => sector.meshShow = isShowed);
        this._sectorsMeshShow = isShowed;
    }

    initTooltip(r: number) {
        this.tooltipPanel = new TextComponent({
            size: new Vector2(Math.sqrt(2 * Math.pow(r, 2)), Math.sqrt(2 * Math.pow(r, 2))),
            pxSize: new Vector2(256, 256),
            background: {color: new Color(this.options.bgColor).getStyle()},
            text: this.options.centerText || {
                value: this.highlightText,
                align: 'center',
                style: {size: '38px', color: 'white'},
                lineHeight: 48,
                autoWrappingHorizontal: false,
                autoWrapping: true,
                margin: {
                    top: 25,
                    bottom: 25
                }
            }
        });
        this.addObject(this.tooltipPanel);
    }

    setActive(sector: Sector = undefined, isActive: boolean = true, duration: number = 200, onUpdate?: Function) {
        const oldPos = sector.uiObject.position.clone();
        const newPos = oldPos.clone();

        const oldColor = isActive ? sector.color : sector.activeColor;
        const newColor = isActive ? sector.activeColor : sector.color;

        newPos.z = isActive ? (this.outerRadius / 3) : 0;

        return new Promise((resolve, reject) => {
            if (sector !== undefined) {
                sector.uiObject.userData.cordTween && sector.uiObject.userData.cordTween.stop();
                sector.active = isActive;
                sector.uiObject.userData.cordTween = new TWEEN.Tween({alpha: 0}).to({alpha: 1}, duration)
                    .onUpdate((alpha) => {
                        const currCord = oldPos.clone().lerp(newPos, alpha);
                        sector.uiObject.position.copy(currCord);

                        const currColor = new Color(oldColor).lerp(new Color(newColor), alpha);
                        (<MeshBasicMaterial>sector.sector.material).color.set(currColor.clone());
                    })
                    .onComplete(() => {
                        resolve(sector);
                    })
                    .start();
            } else {
                // DEACTIVATE ALL SECTORS ============
                this.sectors.forEach(sector => {
                    sector.uiObject.userData.cordTween && sector.uiObject.userData.cordTween.stop();
                    sector.active = false;
                    sector.uiObject.userData.cordTween = new TWEEN.Tween({alpha: 0}).to({alpha: 1}, duration)
                        .onUpdate((alpha) => {
                            const currCord = oldPos.clone().lerp(newPos, alpha);
                            sector.uiObject.position.copy(currCord);

                            const currColor = new Color(oldColor).lerp(new Color(newColor), alpha);
                            (<MeshBasicMaterial>sector.sector.material).color.set(currColor.clone());
                        })
                        .onComplete(() => {
                            resolve();
                        })
                        .start();
                });
            }
        });
    }

    enableMouseEvents(allowMouseEvents: boolean = true) {
        this.allowMouseEvents = allowMouseEvents;
    }

    initEvents(sector: Sector) {
        let lastOverName = '';


        this.actionController.on(ActionControllerEventName.over, sector.sector, (event) => {
            if (!this.allowMouseEvents || !sector.sectorData) return;
            lastOverName = sector.sectorData.name;
            if (this.tooltipEnabled) {
                this.tooltipPanel.setText((sector.sectorData.name.charAt(0) + sector.sectorData.name.slice(1).toUpperCase()));
                this.tooltipPanel.uiObject.visible = true;
            }
            this.fire(ActionControllerEventName.over, new ParentEvent<string>('over', sector));
            this.setActive(sector, true);
        });

        this.actionController.on(ActionControllerEventName.out, sector.sector, () => {
            if (!this.allowMouseEvents || !sector.sectorData) return;
            if (this.tooltipEnabled && lastOverName === sector.sectorData.name) {
                this.tooltipPanel.setText(this.highlightText.toUpperCase());
            }
            this.fire('out', new ParentEvent<string>('out', sector));
            this.setActive(sector, false);
        });

        this.actionController.on(ActionControllerEventName.move, sector.sector, (event) => {
            if (!this.allowMouseEvents || !sector.sectorData) return;
            lastOverName = sector.sectorData.name;
            if (this.tooltipEnabled) {
                this.tooltipPanel.setText((sector.sectorData.name.charAt(0) + sector.sectorData.name.slice(1).replace('_', ' ')).toUpperCase());
                this.tooltipPanel.uiObject.visible = true;
            }
        });

        this.actionController.on(ActionControllerEventName.click, sector.sector, () => {
            if (!this.allowMouseEvents || !sector.sectorData) return;
            this.fire('selected', new ParentEvent<string>('selected', sector));
            if (!this.options.enableSectorAfterClick) this.setActive(sector, false, 0);
            sector.selected();
        });
    }

    disposeObject(object?: Object3D | ViewerModule, disposeParams?: any): void {
        super.disposeObject(object, disposeParams);

        if (!object && disposeParams) object = disposeParams.object;
        this.actionController.off(null, object instanceof Object3D ? object : object.uiObject, null);
    }
}

