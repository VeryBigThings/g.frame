import {WindowComponent} from './WindowComponent';
import {WindowComponentOptions} from './WindowComponent_interfaces';

export class Factory {
    private components: Array<WindowComponent>;

    constructor() {
        this.components = [];
    }

    getComponent(params: WindowComponentOptions): WindowComponent {
        const component = new WindowComponent(params);
        this.components.push(component);
        component.on('dispose', () => this.onDispose(component));

        return component;
    }

    onDispose(component: WindowComponent) {
        this.components.splice(this.components.indexOf(component), 1);
    }
}