import {Factory, ModulesProcessor, ViewerModule} from '@g.frame/core';
import {IPopUpOptions, ITaskTextOptions} from './UIStageManager';
import {Box3, CircleGeometry, Color, Mesh, MeshBasicMaterial, PlaneGeometry, Texture, Vector2, Vector3} from 'three';
import {FONT, Loader, TEXTURE} from '@g.frame/common.loaders';
import {WindowComponent} from '@g.frame/components.window';
import {TextComponent, TextComponentFactory} from '@g.frame/components.text';
import {ActionController, ActionControllerEventName} from '@g.frame/common.action_controller';

const styleConfig = {
    main: {
        background: new Color('#ffffff'),
        bordColor: new Color('#dbb88e'),
        innerBordColor: new Color('#a8876b'),
        borderWidth: 0.15,
        radius: 0.1,
        text: {
            margin: 0.4,
            bodyColor: new Color('#271003'),
            headerColor: new Color('#271203')
        }
    },
    success: {
        background: new Color('#d1fce9'),
        bordColor: new Color('#00d08b'),
        innerBordColor: new Color('#00ae67'),
        borderWidth: 0.15,
        radius: 0.1,
        text: {
            margin: 0.25,
            bodyColor: new Color('#271003'),
            headerColor: new Color('#271203')
        }
    },
    error: {
        background: new Color('#FDD1D1'),
        bordColor: new Color('#ff747f'),
        innerBordColor: new Color('#e25b4f'),
        borderWidth: 0.15,
        radius: 0.1,
        text: {
            margin: 0.25,
            bodyColor: new Color('#271003'),
            headerColor: new Color('#271203')
        }
    },
    voice: {
        radius: 0.25,
        segments: 16,
        margin: 0.075
    }
};

export default class PopUp extends ViewerModule {
    public options: IPopUpOptions;
    public oldOptions: IPopUpOptions;
    private background: WindowComponent;
    private headerText: TextComponent;
    private bodyText: TextComponent;
    private voiceButton: Mesh;
    private backgroundInner: WindowComponent;
    private repeatDisable: boolean = false;

    constructor(private loader: Loader<any>, private actionController: ActionController, private textComponentFactory: TextComponentFactory) {
        super();
        this.loader.addResources([
            {
                name: 'TASKTEXT_main_topright_corner',
                url: require('../../assets/popups/text_main_topright_corner.png'),
                type: TEXTURE
            },
            {
                name: 'TASKTEXT_voice_button',
                url: require('../../assets/popups/voice_button.png'),
                type: TEXTURE
            },
            {
                name: 'OpenSans&otf-800-normal',
                url: require('../../assets/fonts/OpenSans-ExtraBold.otf'),
                type: FONT
            },
            {
                name: 'OpenSans&otf-700-normal',
                url: require('../../assets/fonts/OpenSans-Bold.otf'),
                type: FONT
            },
            {
                name: 'OpenSans&otf-500-normal',
                url: require('../../assets/fonts/OpenSans-Medium.otf'),
                type: FONT
            },
            {
                name: 'OpenSans&otf-400-normal',
                url: require('../../assets/fonts/OpenSans-Regular.otf'),
                type: FONT
            },
            {
                name: 'OpenSans&otf-300-normal',
                url: require('../../assets/fonts/OpenSans-Light.otf'),
                type: FONT
            },
            {
                name: 'RammettoOne&otf-400-normal',
                url: require('../../assets/fonts/RammettoOne-Regular.otf'),
                type: FONT
            },
        ]);

        this.actionController.on(ActionControllerEventName.click, this.uiObject, (event) => {
            if (event.data.intersection.orderNumber !== 0) return;
            if (!this.repeatDisable && this.stopAudio()) this.oldOptions.voice.play();
        });

        this.uiObject.name = 'TaskText';

    }

    set(newOptions?: IPopUpOptions) {
        if (newOptions) {
            this.oldOptions = this.options;
            this.options = newOptions;
        }
        this.background && this.disposeObject(this.background);
        this.backgroundInner && this.disposeObject(this.backgroundInner);
        this.headerText && this.disposeObject(this.headerText);
        this.bodyText && this.disposeObject(this.bodyText);
        this.repeatDisable = this.options.repeatDisable || false;
        if (!this.voiceButton) {
            this.addObject(this.voiceButton = new Mesh(new CircleGeometry(styleConfig.voice.radius * this.options.window.scale, styleConfig.voice.segments), new MeshBasicMaterial({
                map: this.loader.getResource<Texture>('TASKTEXT_voice_button'),
                transparent: true
            })));
        }
        this.voiceButton.visible = !this.options.hideVoiceButton;

        if (this.oldOptions) {
            if (this.oldOptions.additionalObject) this.removeObject(this.oldOptions.additionalObject.object);
        }


        const voiceButtonOffset = this.options.hideVoiceButton ? 0 : (styleConfig.voice.radius + styleConfig.voice.margin) * this.options.window.scale;
        const additionalObjectOffset = this.options.additionalObject
            ? new Box3().setFromObject(this.options.additionalObject.object).getSize(new Vector3()).y / 2 + this.options.additionalObject.margin * this.options.window.scale
            : 0;

        const resultOffset = voiceButtonOffset + additionalObjectOffset;

        if (this.options.additionalObject) {
            this.addObject(this.options.additionalObject.object);
            this.options.additionalObject.object.position.set(
                0,
                (-this.options.window.size.y / 2 + additionalObjectOffset) * this.options.window.scale,
                0.02);
            this.voiceButton.position.set(
                0,
                (-this.options.window.size.y / 2 +
                    additionalObjectOffset +
                    this.options.additionalObject.margin +
                    voiceButtonOffset +
                    styleConfig.voice.margin)
                * this.options.window.scale,
                0.02
            );
        } else {
            this.voiceButton.position.set(
                0,
                (-this.options.window.size.y / 2 + voiceButtonOffset * this.options.window.scale),
                0.02);
        }

        if (this.options.voice) {
            if (this.oldOptions?.voice) this.oldOptions.voice?.pause();
            this.oldOptions.voice = this.options.voice;
            this.oldOptions.voice.currentTime = 0;
            this.oldOptions.voice.play();
        } else {
            if (this.oldOptions?.voice) this.oldOptions.voice.pause();
            if (this.oldOptions) this.oldOptions.voice = null;
        }


        const backgroundSize = this.options.window.size.clone().multiplyScalar(this.options.window.scale);

        this.addObject(this.background = new WindowComponent({
            size: backgroundSize,
            bordColor: styleConfig[this.options.window.type].bordColor.getHex(),
            background: styleConfig[this.options.window.type].innerBordColor.getHex(),
            bordWidth: styleConfig[this.options.window.type].borderWidth,
            bordRadius: styleConfig[this.options.window.type].radius
        }));

        this.background.uiObject.position.z -= 0.1;

        this.addObject(this.backgroundInner = new WindowComponent({
            size: backgroundSize.clone().sub(new Vector2(0.075, 0.075).multiplyScalar(this.options.window.scale)),
            background: styleConfig[this.options.window.type].background.getHex(),
        }));

        const headerSize = new Vector2(
            this.options.window.size.x - styleConfig[this.options.window.type].text.margin * 2 * this.options.window.scale,
            (this.options.window.size.y - resultOffset * 2) * .3 - styleConfig[this.options.window.type].text.margin * 2 * this.options.window.scale
        );

        this.addObject(this.headerText = this.textComponentFactory.get({
                size: headerSize,
                pxSize: new Vector2(256 * headerSize.x * this.options.window.pxScale, 256 * headerSize.y * this.options.window.pxScale),
                text: {
                    value: this.options.header || '',
                    autoWrappingHorizontal: false,
                    autoWrapping: true,
                    align: 'center',
                    style: {
                        family: 'RammettoOne',
                        weight: '400',
                        size: '80px',
                        color: styleConfig[this.options.window.type].text.headerColor.getStyle(),
                    },
                    lineHeight: 80,
                },
                background: {
                    color: 'transparent'
                    // color: 'green'

                }
            }
        ));
        this.headerText.uiObject.position.set(
            0,
            this.options.window.size.y / 2 - headerSize.y / 2 - (styleConfig[this.options.window.type].text.margin) * this.options.window.scale,
            0.01);

        const additionalBodyScale = this.options.additionalBodyScale || new Vector2(1, 1);

        const bodySize = new Vector2(
            this.options.window.size.x * additionalBodyScale.x - styleConfig[this.options.window.type].text.margin * 2,
            (this.options.window.size.y - resultOffset * 2) * .7 * additionalBodyScale.y - styleConfig[this.options.window.type].text.margin * 2
        );
        this.addObject(this.bodyText = this.textComponentFactory.get({
                size: bodySize,
                pxSize: new Vector2(256 * bodySize.x, 256 * bodySize.y),
                text: {
                    value: this.options.body,
                    autoWrappingHorizontal: false,
                    autoWrapping: false,
                    align: 'center',
                    style: {
                        family: 'OpenSans',
                        weight: '400',
                        size: '48px',
                        color: styleConfig[this.options.window.type].text.bodyColor.getStyle()
                    },
                    lineHeight: 60,
                },
                background: {
                    // color: 'green'
                    color: 'transparent'
                }
            }
        ));
        // this.bodyText.uiObject.visible = false;
        this.bodyText.uiObject.position.set(0, 0, 0.01);
    }

    stopAudio(): boolean {
        if (this.oldOptions?.voice) {
            this.oldOptions.voice.pause();
            this.oldOptions.voice.currentTime = 0;
            return true;
        }
        return false;
    }
}
