import {Color, Mesh, MeshBasicMaterial, Object3D, Vector2, Vector3, Box3, PlaneGeometry} from 'three';
import {Tween, ViewerModule, ParentEvent} from '@g.frame/core';

import {IDropdownComponentOptions} from './DropdownComponent_interfaces';
import {TextComponent} from '@g.frame/components.text';
import {WindowComponent} from '@g.frame/components.window';
import {
    ActionController,
    ActionControllerEventName
} from '@g.frame/common.action_controller';
import {ObjectsPositioning} from '../../g.frame.core/build/main/utils';
// import * as TWEEN from '../libs/TWEEN/Tween';


export class DropdownComponent extends ViewerModule {
    public isOpened: boolean = true;
    private wrapHead: Object3D;
    private selectedText: TextComponent;
    private wrapOptionList: Object3D;
    private optionListComponents: Array<{mesh: Object3D, text?: string, key: string}> = [];
    private icon: TextComponent;
    private options: IDropdownComponentOptions;

    constructor(options: IDropdownComponentOptions, private actionController: ActionController) {
        super();
        this.options = options;

        if (this.options.fontSize === undefined) this.options.fontSize = '60px';
        if (this.options.headStyle === undefined) this.options.headStyle = {};
        if (this.options.headStyle.color === undefined) this.options.headStyle.color = '#000000';
        if (this.options.headStyle.bgColor === undefined) this.options.headStyle.bgColor = '#ffffff';
        if (this.options.headStyle.selectedFontSize === undefined) this.options.headStyle.selectedFontSize = this.options.fontSize;
        if (this.options.headStyle.arrowFontSize === undefined) this.options.headStyle.arrowFontSize = this.options.fontSize;
        if (this.options.headStyle.arrowSymbols === undefined) this.options.headStyle.arrowSymbols = {opened: '', closed: ''};
        if (this.options.headStyle.headSideOffset === undefined) this.options.headStyle.headSideOffset = 0;
        if (this.options.headStyle.placeholderText === undefined) this.options.headStyle.placeholderText = 'Select...';
        if (this.options.optionsStyle === undefined) this.options.optionsStyle = {};
        if (this.options.optionsStyle.fontSize === undefined) this.options.optionsStyle.fontSize = this.options.fontSize;
        if (this.options.optionsStyle.color === undefined) this.options.optionsStyle.color = '#000000';
        if (this.options.optionsStyle.bgColor === undefined) this.options.optionsStyle.bgColor = '#ffffff';
        if (this.options.optionsStyle.hoverBorderColor === undefined) this.options.optionsStyle.hoverBorderColor = this.options.optionsStyle.color;
        if (this.options.optionsStyle.height === undefined) {
            if (this.options.headStyle.headerWrap) {
                this.options.optionsStyle.height = new Box3().setFromObject(this.options.headStyle.headerWrap).getSize(new Vector3()).y;
            }
            else this.options.optionsStyle.height = this.options.size.y;
        }
        if (this.options.optionsStyle.margin === undefined) this.options.optionsStyle.margin = 0;
        else {
            // @ts-ignore
            if (this.options.optionsStyle.margin.left === undefined) this.options.optionsStyle.margin.left = 0;
            // @ts-ignore
            if (this.options.optionsStyle.margin.right === undefined) this.options.optionsStyle.margin.right = 0;
            // @ts-ignore
            if (this.options.optionsStyle.margin.top === undefined) this.options.optionsStyle.margin.top = 0;
            // @ts-ignore
            if (this.options.optionsStyle.margin.bottom === undefined) this.options.optionsStyle.margin.bottom = 0;
        }

        this.isOpened = false;

        this.init();
        this.initOptionList();
        this.initEvents();
    }

    init() {
        if (!this.options.headStyle.headerWrap) {
            this.wrapHead = new WindowComponent({
                size: this.options.size,
                bordColor: new Color(this.options.headStyle.color).getHex(),
                background: new Color(this.options.headStyle.bgColor).getHex(),
                bordWidth: 0,
                bordRadius: 0.1
            }).uiObject;
        }
        else {
            this.wrapHead = this.options.headStyle.headerWrap;
            const componentSize = new Box3().setFromObject(this.wrapHead).getSize(new Vector3());
            this.options.size = new Vector2(componentSize.x, componentSize.y);
        }
        this.addObject(this.wrapHead);


        this.icon = this.options.headStyle.arrowComponent || new TextComponent({
            size: new Vector2(12, 2),
            pxSize: new Vector2(512, 256 / 3),
            text: {
                style: {
                    size: this.options.headStyle.arrowFontSize,
                    weight: '400', family: 'FontAwesome',
                    color: this.options.headStyle.color,
                },
                lineHeight: parseInt(this.options.headStyle.arrowFontSize) * 0.77,
                autoWrappingHorizontal: true,
                autoWrapping: true,
                value: this.options.headStyle.arrowSymbols.closed,
                margin: {right: this.options.headStyle.headSideOffset},
            },
            background: {color: 'transparent'}
        });
        this.icon.setText(this.options.headStyle.arrowSymbols.closed);

        const arrowSize = new Box3().setFromObject(this.icon.uiObject).getSize(new Vector3());
        this.icon.uiObject.position.x = (this.options.size.x / 2) - (arrowSize.x / 2) - this.options.headStyle.headSideOffset;
        this.icon.uiObject.position.z = 0.01;


        const selectedTextWidth = this.options.size.x - arrowSize.x - this.options.headStyle.headSideOffset * 2;
        this.selectedText = new TextComponent({
            size: new Vector2(selectedTextWidth, this.options.size.y),
            pxSize: new Vector2(512, 512 / (selectedTextWidth / this.options.size.y)),
            text: {
                style: {
                    size: this.options.headStyle.selectedFontSize,
                    color: this.options.headStyle.color,
                },
                lineHeight: parseInt(this.options.headStyle.selectedFontSize) * 0.91,
                align: 'left',
                // margin: {bottom: 10},
                autoWrappingHorizontal: true,
                autoWrapping: true,
                value: this.options.headStyle.placeholderText,
                margin: {bottom: parseInt(this.options.headStyle.selectedFontSize) * 0.2},
            },
            background: {color: 'transparent'},
        });
        const selectedTextSize = new Box3().setFromObject(this.selectedText.uiObject).getSize(new Vector3());
        this.selectedText.uiObject.position.x = (-this.options.size.x / 2) + (selectedTextSize.x / 2) + this.options.headStyle.headSideOffset;
        this.selectedText.uiObject.position.z = 0.01;

        if (this.options.defaultSelectedOptionId) {
            this.setSelectedText(this.options.optionList[this.options.defaultSelectedOptionId].body);
        }
        else this.setSelectedText(this.options.headStyle.placeholderText);


        this.wrapHead.add(this.selectedText.uiObject);
        this.wrapHead.add(this.icon.uiObject);
    }

    initOptionList() {
        this.addObject(this.wrapOptionList = new Object3D());
        this.wrapOptionList.position.z = 0.01;
        this.wrapOptionList.visible = false;

        this.optionListComponents = [];

        this.options.optionList.forEach(optionData => {
            if ((typeof optionData.body) === 'string') {
                const optionMesh = new TextComponent({
                    size: new Vector2(12, 2),
                    pxSize: new Vector2(512, 256 / 3),
                    text: {
                        style: {size: this.options.optionsStyle.fontSize, color: this.options.optionsStyle.color},
                        lineHeight: (parseInt(this.options.optionsStyle.fontSize) * 0.95),
                        autoWrappingHorizontal: true,
                        autoWrapping: true,
                        value: <string>optionData.body,
                        margin: {
                            // @ts-ignore
                            left: this.options.optionsStyle.margin.left,
                            // @ts-ignore
                            top: this.options.optionsStyle.margin.top,
                            // @ts-ignore
                            right: this.options.optionsStyle.margin.right,
                            // @ts-ignore
                            bottom: this.options.optionsStyle.margin.bottom + parseInt(this.options.optionsStyle.fontSize) * 0.2
                        },
                    },
                    background: {color: 'transparent'}
                });
                optionMesh.uiObject.position.z = 0.02;

                this.optionListComponents.push({
                    mesh: optionMesh.uiObject,
                    text: <string>optionData.body,
                    key: optionData.key
                });
                this.wrapOptionList.add(optionMesh.uiObject);
            }
        });


        ObjectsPositioning.adjustObjects(this.optionListComponents.map(optionMesh => optionMesh.mesh), false, .1);

        const wrapOptionListSize = new Box3().setFromObject(this.wrapOptionList).getSize(new Vector3());
        this.wrapOptionList.position.y = (-wrapOptionListSize.y / 2) - (this.options.size.y / 1.6);

        const headerBox3 = new Box3().setFromObject(this.wrapHead);
        this.wrapOptionList.position.x = this.wrapHead.position.x;

        const optionListOverlayWidth = (wrapOptionListSize.x < headerBox3.getSize(new Vector3()).x) ? headerBox3.getSize(new Vector3()).x : wrapOptionListSize.x;
        const optionListOverlay = new WindowComponent({
            size: new Vector2(optionListOverlayWidth, wrapOptionListSize.y),
            // bordColor: new Color(this.options.optionsStyle.bgColor).getHex(),
            bordColor: new Color('this.options.optionsStyle.bgColor').getHex(),
            background: new Color(this.options.optionsStyle.bgColor).getHex(),
            bordWidth: 0,
            bordRadius: 0.2
        });
        this.wrapOptionList.add(optionListOverlay.uiObject);


        this.optionListComponents.forEach(options => {
            if ((typeof this.options.optionList[0].body) === 'string') {
                options.mesh.position.x = 0;

                const optionMeshSize = new Box3().setFromObject(options.mesh).getSize(new Vector3());
                const optionOverlayPlane = new Mesh(
                    new PlaneGeometry(optionListOverlayWidth, optionMeshSize.y),
                    new MeshBasicMaterial({visible: false})
                );
                options.mesh.add(optionOverlayPlane);

                const optionOverlayMesh = new WindowComponent({
                    size: new Vector2(optionListOverlayWidth, optionMeshSize.y),
                    bordColor: new Color(this.options.optionsStyle.hoverBorderColor).getHex(),
                    background: new Color(this.options.optionsStyle.bgColor).getHex(),
                    bordWidth: (this.options.optionsStyle.disableBorder) ? 0 : 0.07,
                    bordRadius: 0.1
                });
                optionOverlayMesh.uiObject.visible = false;
                optionOverlayMesh.uiObject.position.z = -0.001;
                options.mesh.userData.overlayComponent = optionOverlayMesh;
                options.mesh.add(optionOverlayMesh.uiObject);
            }
        });
    }

    private initEvents() {
        console.log('initEvents ===============');
        this.actionController.on(ActionControllerEventName.click, this.wrapHead, (event) => {
            console.log('event', event);
            if (event.data.intersection.orderNumber !== 0) return;
            this.isOpened = !this.isOpened;
            this.wrapOptionList.visible = this.isOpened;
            this.icon.setText(this.options.headStyle.arrowSymbols[this.isOpened ? 'opened' : 'closed']);
        });

        this.optionListComponents.forEach((optionEl, index) => {
            this.actionController.on(ActionControllerEventName.click, optionEl.mesh, (event) => {
                // if (event.orderNumber !== 0) return;
                this.isOpened = false;
                this.wrapOptionList.visible = false;

                this.toggleHover(false, optionEl.mesh);

                this.icon.setText(this.options.headStyle.arrowSymbols.closed);
                this.setSelectedText(this.optionListComponents[index].text);

                this.fire('changed', new ParentEvent('changed', {option: optionEl}));
            });

            this.actionController.on(ActionControllerEventName.over, optionEl.mesh, () => this.toggleHover(true, optionEl.mesh));

            this.actionController.on(ActionControllerEventName.out, optionEl.mesh, () => this.toggleHover(false, optionEl.mesh));
        });
    }

    setSelectedText(text: string) {
        const arrowSize = new Box3().setFromObject(this.icon.uiObject).getSize(new Vector3());
        const maxSelectedTextWidth = (this.options.size.x - arrowSize.x - this.options.headStyle.headSideOffset * 2) * 0.99;

        let displaySelectedText = text;
        this.selectedText.setText(displaySelectedText);

        for (;;) {
            const selectedTextWidth = new Box3().setFromObject(this.selectedText.uiObject).getSize(new Vector3()).x;
            if (selectedTextWidth > maxSelectedTextWidth) {
                displaySelectedText = displaySelectedText.slice(0, -1);
                this.selectedText.setText(displaySelectedText + '...');
            }
            else break;
            if (!displaySelectedText.length) break;
        }

        const selectedTextSize = new Box3().setFromObject(this.selectedText.uiObject).getSize(new Vector3());
        this.selectedText.uiObject.position.x = (-this.options.size.x / 2) + (selectedTextSize.x / 2) + this.options.headStyle.headSideOffset;
    }


    toggleHover(isActive: boolean = true, object: Object3D, duration: number = 200, onUpdate?: Function) {
        if (this.options.optionsStyle.disableBorder) {
            const oldScale = object.scale.clone();
            const newScale = isActive ? new Vector3(1.04, 1.04, 1.04) : new Vector3(1, 1, 1);

            object.userData.cordTween = new Tween({alpha: 0}).to({alpha: 1}, duration)
                .onUpdate((alpha) => {
                    const currScale = oldScale.clone().lerp(newScale, alpha);
                    object.scale.copy(currScale);
                })
                .start();
        }
        else {
            object.userData.overlayComponent.uiObject.visible = isActive;
        }
    }
}

