import { Loader } from '@verybigthings/g.frame.common.loaders';
import { OculusQuestView, IOculusQuestView } from './OculusQuestView';
import { OculusQuestModel } from '../OculusQuestModel';

export class OculusQuestViewChanger {
    private currentOculusQuestView: IOculusQuestView;
    private previousOculusQuestView: IOculusQuestView;

    constructor(private oculusQuestModel: OculusQuestModel, whichView: string = 'default') {
        if (whichView === 'default') {
            this.currentOculusQuestView = new OculusQuestView();
        }
    }

    public getCurrentView(): IOculusQuestView {
        return this.currentOculusQuestView;
    }

    public getPreviousView(): IOculusQuestView {
        return this.previousOculusQuestView;
    }

    public setNewView(newOculusQuestView: IOculusQuestView) {
        this.previousOculusQuestView = this.currentOculusQuestView;
        this.currentOculusQuestView = newOculusQuestView;
        this.oculusQuestModel.updateView(this.currentOculusQuestView);
    }

    public setCurrentView() {
        this.oculusQuestModel.updateView(this.currentOculusQuestView);
    }

    public setPreviousView() {
        this.oculusQuestModel.updateView(this.previousOculusQuestView);
    }

    public removeView() {
        this.oculusQuestModel.updateView(null);
    }

    prepareResources(loader: Loader<any>) {
        if (!this.currentOculusQuestView.loaded()) this.currentOculusQuestView.prepareResources(loader);
    }
}