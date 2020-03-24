import {ActionController, Factory, ParentEvent, ViewerModule} from '@verybigthings/g.frame.core';
import {Object3D} from 'three';
import {TextComponent} from './TextComponent';
import {ITextComponentOptions} from './TextComponent_interfaces';

export class TextComponentFactory extends Factory<TextComponent> {
    __constructor: typeof TextComponent = TextComponent;
    private components: Array<TextComponent>;
    private actionController: ActionController;

    constructor() {
        super();
        this.components = [];
    }

    setActionController(actionController: ActionController) {
        this.actionController = actionController;
    }

    get(params: ITextComponentOptions): TextComponent {
        const component = new TextComponent(params);
        this.components.push(component);
        component.on('dispose', (event: ParentEvent) => this.onDispose(component, event.data.disposedObject));
        return component;
    }

    onDispose(component: TextComponent, disposedObject: Object3D | ViewerModule) {
        if (disposedObject === component) this.components.splice(this.components.indexOf(component), 1);
    }

    update(params: any): any {
    }
}