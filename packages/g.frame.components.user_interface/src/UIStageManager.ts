import {EventDispatcher, ModulesProcessor, ViewerModule} from '@g.frame/core';
import {Euler, Object3D, Vector2, Vector3} from 'three';
import TaskText from './TaskText';
import TaskStepper from './TaskStepper';
import {AUDIO, Loader, TEXTURE} from "@g.frame/common.loaders";
import PopUp from './PopUp';
import {ActionController} from "@g.frame/common.action_controller";
import {TextComponentFactory} from "@g.frame/components.text";
import UIStage from "./UIStage";

export interface ITaskStepperOptions {
    current: number;
    max: number;
    scale?: number;
    position?: Vector3;
    rotation?: Euler;
}

export interface IPopUpOptions {
    header?: string;
    body: string;
    voice: HTMLAudioElement;
    hideVoiceButton?: boolean;
    showStartButton?: boolean;
    additionalObject?: {
        object: Object3D;
        margin: number;
    };
    window: {
        size: Vector2;
        scale: number;
        pxScale: number;
        type?: 'main' | 'error' | 'success';
    };
    additionalBodyScale?: Vector2;
    repeatDisable?: boolean;
}
export interface ITaskTextOptions {
    body: string;
    voice: HTMLAudioElement;
    hideVoiceButton?: boolean;
    showStartButton?: boolean;
    additionalObject?: {
        object: Object3D;
        margin: number;
    };
    window: {
        size: Vector2;
        scale: number;
        pxScale: number;
        position?: Vector3;
        rotation?: Euler;
        type?: 'main';
    };
    repeatDisable?: boolean;
}

export interface IUIStageOptions {
    progress?: ITaskStepperOptions;
    text: ITaskTextOptions;
    popup?: IPopUpOptions;
}


export default class UIStageManagerClass extends EventDispatcher<any> {
    public currentUIStage: IUIStageOptions;
    private levelModules: Array<UIStage> = [];
    private successSound: HTMLAudioElement;
    private progress: TaskStepper;
    private text: TaskText;
    private popUp: PopUp;
    private loader: Loader<any>;
    private actionController: ActionController;
    private textComponentFactory: TextComponentFactory;

    constructor() {
        super();
    }

    setModules(loader: Loader<any>, actionController: ActionController, textComponentFactory: TextComponentFactory) {
        this.loader = loader;
        this.actionController = actionController;
        this.textComponentFactory = textComponentFactory;
        this.loader.addResources([
            {
                name: 'IMAGEPLACEHOLDER_completed',
                url: require('../../assets/popups/imageplaceholder_completed.png'),
                type: TEXTURE
            },
            {
                name: 'VOICE_success_message__0',
                url: require('../../assets/audio/voiceover/fail_message_0.mp3'),
                type: AUDIO
            },
            {
                name: 'VOICE_success_message__1',
                url: require('../../assets/audio/voiceover/fail_message_1.mp3'),
                type: AUDIO
            },
            {
                name: 'VOICE_success_message__2',
                url: require('../../assets/audio/voiceover/fail_message_2.mp3'),
                type: AUDIO
            },
            {
                name: 'VOICE_success_message__3',
                url: require('../../assets/audio/voiceover/fail_message_3.mp3'),
                type: AUDIO
            },
        ]);

        this.progress = new TaskStepper(this.loader);
        this.text = new TaskText(this.loader, this.actionController, this.textComponentFactory);
        this.popUp = new PopUp(this.loader, this.actionController, this.textComponentFactory);
        this.popUp.uiObject.visible = false;
    }

    addToContainer(container: Object3D) {
        container.add(this.progress.uiObject);
        container.add(this.text.uiObject);
        container.add(this.popUp.uiObject);
    }

    addModule(newUIModule: UIStage) {
        this.levelModules.push(newUIModule);
    }

    update(newStage?: IUIStageOptions) {
        this.hidePopUpScreen();
        this.stopAudio();
        if (newStage) this.currentUIStage = newStage;

        if (this.currentUIStage.progress) {
            this.progress.uiObject.visible = true;
            this.progress.set(this.currentUIStage.progress);
            this.currentUIStage.progress.position ? this.progress.uiObject.position.copy(this.currentUIStage.progress.position) : this.progress.uiObject.position.set(0, 2, 0);
            this.currentUIStage.progress.rotation ? this.progress.uiObject.rotation.copy(this.currentUIStage.progress.rotation) : this.progress.uiObject.rotation.set(0, 0, 0);
        } else {
            this.progress.uiObject.visible = false;
        }

        this.text.set(this.currentUIStage.text);
        this.currentUIStage.text.window.position ? this.text.uiObject.position.copy(this.currentUIStage.text.window.position) : this.text.uiObject.position.set(0, 0, 0);
        this.currentUIStage.text.window.rotation ? this.text.uiObject.rotation.copy(this.currentUIStage.text.window.rotation) : this.text.uiObject.rotation.set(0, 0, 0);
    }

    showPopUpScreen(
        config: IPopUpOptions,
        position?: Vector3,
        rotation?: Euler) {

        this.popUp.set(config);

        this.text.stopAudio();

        if (position) this.popUp.uiObject.position.copy(position);
        else          this.popUp.uiObject.position.set(0, 0, 3);

        if (rotation) this.popUp.uiObject.rotation.copy(rotation);
        else          this.popUp.uiObject.rotation.set(0, 0, 0);

        this.popUp.uiObject.visible = true;
        this.popUp.update();

        // if (this.popUp.uiObject.userData.timeoutAnimation) {
        //     clearTimeout(this.popUp.uiObject.userData.timeoutAnimation);
        //     this.popUp.uiObject.visible = true;
        // }
        // this.popUp.uiObject.userData.timeoutAnimation = setTimeout(() => {
        //     if (this.popUp.uiObject.userData.scaleAnimation) {
        //         clearInterval(this.popUp.uiObject.userData.scaleAnimation);
        //         this.popUp.uiObject.scale.setScalar(scaleValue);
        //         this.popUp.uiObject.visible = true;
        //     }
        //     this.popUp.uiObject.userData.scaleAnimation = setInterval(() => {
        //         if (this.popUp.uiObject.scale.x > (scaleValue * 0.1)) {
        //             this.popUp.uiObject.scale.x += -(scaleValue * .05);
        //             this.popUp.uiObject.scale.y += -(scaleValue * .05);
        //         } else {
        //             this.popUp.uiObject.visible = false;
        //             this.popUp.stopAudio();
        //             if (this.text.stopAudio()) this.text.oldOptions.voice.play();
        //             clearInterval(this.popUp.uiObject.userData.scaleAnimation);
        //         }
        //
        //     }, 10);
        // }, 4000);
    }

    hidePopUpScreen() {
        // if (this.popUp.uiObject.userData.timeoutAnimation) {
        //     clearTimeout(this.popUp.uiObject.userData.timeoutAnimation);
        //     this.popUp.uiObject.scale.setScalar(1);
        //     this.popUp.uiObject.visible = true;
        // }
        if (this.popUp.uiObject.userData.scaleAnimation) {
            this.popUp.uiObject.visible = false;
            this.popUp.stopAudio();
            clearInterval(this.popUp.uiObject.userData.scaleAnimation);
        } else {
            this.popUp.uiObject.userData.scaleAnimation = setInterval(() => {
                if (this.popUp.uiObject.scale.x > 0.1) {
                    this.popUp.uiObject.scale.x += -.05;
                    this.popUp.uiObject.scale.y += -.05;
                } else {
                    this.popUp.uiObject.visible = false;
                    this.popUp.stopAudio();
                    clearInterval(this.popUp.uiObject.userData.scaleAnimation);
                }

            }, 10);
        }
    }

    setActiveStageByName(name: string) {
        this.currentUIStage = this.levelModules.find(el => el.stageName === name).currentUIStage;
        this.update();
    }

    setActiveStageByIndex(index: number) {
        this.currentUIStage = this.levelModules[index].currentUIStage;
        this.update();
    }

    setActiveStageByModule(uiStageModule: UIStage) {
        this.currentUIStage = this.levelModules.find(el => el === uiStageModule).currentUIStage;
        this.update();
    }

    hide() {
        this.progress.uiObject.visible = false;
        this.text.uiObject.visible = false;
    }

    show() {
        this.progress.uiObject.visible = true;
        this.text.uiObject.visible = true;
    }

    stopAudio() {
        this.text.stopAudio();
        this.popUp.stopAudio();
        if (this.successSound) this.successSound.pause();
    }

    playSuccessSound() {
        if (this.successSound) this.successSound.pause();
        this.stopAudio();
        this.hidePopUpScreen();
        this.successSound = this.getRandomSuccessSound();
        this.successSound.currentTime = 0;
        this.successSound.play();
    }

    getRandomSuccessSound() {
        const soundIndex = Math.floor(Math.random() * 4);
        return this.loader.getResource<HTMLAudioElement>('VOICE_success_message_' + soundIndex);
    }
}
