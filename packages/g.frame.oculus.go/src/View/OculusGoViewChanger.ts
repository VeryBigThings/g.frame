import { Loader } from '@verybigthings/g.frame.common.loaders';
import { OculusGoView, IOculusGoView } from './OculusGoView';
import { OculusGoModel } from '../OculusGoModel';

export class OculusGoViewChanger {
    private currentOculusGoView: IOculusGoView;
    private previousOculusGoView: IOculusGoView;

    constructor(private oculusGoModel: OculusGoModel, whichView: string = 'default') {
        if (whichView === 'default') {
            this.currentOculusGoView = new OculusGoView();
        }
    }

    public getCurrentView(): IOculusGoView {
        return this.currentOculusGoView;
    }

    public getPreviousView(): IOculusGoView {
        return this.previousOculusGoView;
    }

    public setNewView(newOculusGoView: IOculusGoView) {
        this.previousOculusGoView = this.currentOculusGoView;
        this.currentOculusGoView = newOculusGoView;
        this.oculusGoModel.updateView(this.currentOculusGoView);
    }

    public setCurrentView() {
        this.oculusGoModel.updateView(this.currentOculusGoView);
    }

    public setPreviousView() {
        this.oculusGoModel.updateView(this.previousOculusGoView);
    }

    public removeView() {
        this.oculusGoModel.updateView(null);
    }

    prepareResources(loader: Loader<any>) {
        if (!this.currentOculusGoView.loaded()) this.currentOculusGoView.prepareResources(loader);
    }
}