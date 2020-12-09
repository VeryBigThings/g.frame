import {Camera, Object3D, Scene} from 'three';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {OrbitControls} from '@verybigthings/g.frame.desktop';

export default class AttachTransformControls {
    public currentAttachedObject: Object3D;
    public inited: boolean = false;
    private scene: Scene;
    private camera: Camera;
    private controls: OrbitControls;
    private domElement: any;
    private transformControls: TransformControls;

    constructor() {
    }

    public init(domElement: any, scene: any, camera: any, controls?: OrbitControls) {
        this.domElement = domElement;
        this.scene = scene;
        this.camera = camera;
        this.controls = controls || this.controls;
        this.initTransfromControls();
    }

    setControls(controls: OrbitControls) {
        this.controls = controls;
    }

    public attach(object?: Object3D) {
        if (!this.inited) {
            console.warn('AttachTransformControls used before inited');
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
        }
    }

    private initTransfromControls() {
        if (this.inited) return;

        this.inited = true;
        this.transformControls = new TransformControls(this.camera, this.domElement);
        const transformControls = this.transformControls;

        this.transformControls.addEventListener('dragging-changed', function (event) {
            // @ts-ignore
            this.controls.enabled = !event.value;
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
