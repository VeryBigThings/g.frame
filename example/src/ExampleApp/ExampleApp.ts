import { ViewerModule } from '../../../src/core/ViewerModule';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

export default class ExampleApp extends ViewerModule {
    constructor() {
        super();

        this.init();
    }

    init() {
        const box = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial({color: '#ff3333'}));

        this.uiObject.add(box);
    }
}