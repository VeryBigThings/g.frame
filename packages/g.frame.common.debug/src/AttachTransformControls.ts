import {Camera, Object3D, Scene} from 'three';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {OrbitControls} from '@g.frame/desktop';

export default class AttachTransformControls {
    public currentAttachedObject: Object3D;
    public inited: boolean = false;
    private scene: Scene;
    private camera: Camera;
    private controls: OrbitControls;
    private domElement: HTMLElement;
    private transformControls: TransformControls;

    constructor() {
    }

    public init(domElement: HTMLElement, scene: Scene, camera: Camera, controls?: OrbitControls) {
        this.domElement = domElement;
        this.scene = scene;
        this.camera = camera;
        this.controls = controls || this.controls;
        this.initTransformControls();
    }

    setControls(controls: OrbitControls) {
        this.controls = controls;
    }

    public attach(object?: Object3D) {
        if (!this.inited) {
            console.warn('AttachTransformControls used before inited');
            return;
        }

        if (object && !object.visible) {
            console.log(`%cObject invisible`, 'color: red;');
            return;
        }
        if (this.currentAttachedObject) {
            this.transformControls.detach();
            this.scene.remove(this.transformControls);
        }
        if (object) {
            this.transformControls.attach(object);
            this.scene.add(this.transformControls);
            this.currentAttachedObject = object;
            console.log('%cTransform result', 'color: green;');
            console.log('%cTransformControls keyboard shortcuts', 'color: orange;');
            console.log('"W" translate | "E" rotate | "R" scale | "+" increase size | "-" decrease size \n"Q" toggle world/local space \n"X" toggle X | "Y" toggle Y | "Z" toggle Z | "Spacebar" toggle enabled');
        }
    }

    public detach() {
        this.transformControls.detach();
    }

    private initTransformControls() {
        if (this.inited) return;

        this.inited = true;
        this.transformControls = new TransformControls(this.camera, this.domElement);
        const transformControls = this.transformControls;

        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.controls.enabled = !event.value;

            console.log('%cTransform result', 'color: green;');
            console.log('Local position:', `${this.currentAttachedObject.position.x}, ${this.currentAttachedObject.position.y}, ${this.currentAttachedObject.position.z} `);
            console.log('Local rotation:', `${this.currentAttachedObject.rotation.x}, ${this.currentAttachedObject.rotation.y}, ${this.currentAttachedObject.rotation.z} `);
        });

        window.addEventListener('keydown', function (event) {

            switch (event.keyCode) {

                case 81: // Q
                    transformControls.setSpace(transformControls.space === 'local' ? 'world' : 'local');
                    break;

                case 87: // W
                    transformControls.setMode('translate');
                    break;

                case 69: // E
                    transformControls.setMode('rotate');
                    break;

                case 82: // R
                    transformControls.setMode('scale');
                    break;

                case 187:
                case 107: // +, =, num+
                    transformControls.setSize(transformControls.size + 0.1);
                    break;

                case 189:
                case 109: // -, _, num-
                    transformControls.setSize(Math.max(transformControls.size - 0.1, 0.1));
                    break;

                case 88: // X
                    transformControls.showX = !transformControls.showX;
                    break;

                case 89: // Y
                    transformControls.showY = !transformControls.showY;
                    break;

                case 90: // Z
                    transformControls.showZ = !transformControls.showZ;
                    break;

                case 32: // Spacebar
                    transformControls.enabled = !transformControls.enabled;
                    break;

            }

        });
    }
}
