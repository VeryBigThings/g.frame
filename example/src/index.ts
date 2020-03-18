import BigG from '../../src/BigG';
import ExampleApp from './ExampleApp/ExampleApp';

class App {
    private framework: BigG;

    constructor() {

        const mainModule = new ExampleApp();
        const modules = [];


        this.framework = new BigG(mainModule, modules);

        this.init();
    }

    init() {



    }
}

new App();
