import {EventDispatcher} from '@g.frame/core';
import {Euler, Vector3} from 'three';
import UIStageManagerClass, {IPopUpOptions, IUIStageOptions} from './UIStageManager';

export default class UIStage extends EventDispatcher<any> {
    currentUIStage: IUIStageOptions;

    constructor(public stageName: string, public uiStageManager: UIStageManagerClass) {
        super();
    }

    setStage(newStage: IUIStageOptions) {
        this.uiStageManager.update(newStage);
        this.currentUIStage = newStage;
    }

    playSuccessSound() {
        this.uiStageManager.playSuccessSound();
    }

    showPopUpScreen(config: IPopUpOptions, position?: Vector3, rotation?: Euler) {
        this.uiStageManager.showPopUpScreen(config, position, rotation);
    }

    hidePopUpScreen() {
        this.uiStageManager.hidePopUpScreen();
    }

    stopAudio() {
        this.uiStageManager.stopAudio();
    }

}
