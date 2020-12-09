import { GComponent } from '@verybigthings/g.frame.core';
import {
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Ray,
    Raycaster,
    Scene,
    SphereGeometry,
    Vector3,
    Camera
} from 'three';

const config = {
    radius: .01,
    color: 0xff00ff
};

interface IPointerOptions {
    minDistance?: number;
    maxDistance?: number;
    color?: number;
}

export class Pointer extends GComponent {
    public defaultPointerMesh: Mesh;
    public pointerContainer: Object3D;
    public currentCustomPointer: Object3D;
    public scaleFactor: number = 1;
    public maxDistance: number = 50;
    public minDistance: number = 0.1;
    private raycaster: Raycaster;
    private scene: Scene;
    private camera: Camera;
    private lastDistance: number = 10;

    constructor(scene: Scene, options?: IPointerOptions, camera?: any) {
        super();
        this.scene = scene;
        this.camera = camera;
        options && options.minDistance && (this.minDistance = options.minDistance);
        options && options.maxDistance && (this.maxDistance = options.maxDistance);
        options && options.color && (config.color = options.color);
        this.init();
    }

    init() {
        this.pointerContainer = new Object3D();
        this.raycaster = new Raycaster();
        this.raycaster.far = 100000;
        this.raycaster.near = 0.1;
        this.addObject(this.pointerContainer);
        this.resetDefaultPointer();
    }

    // disposes the whole pointerContainer, so to set the pointer to default use resetDefaultPointer()
    resetDefaultPointer() {
        this.clearPointerContainer();
        this.defaultPointerMesh = new Mesh(new SphereGeometry(config.radius, 12, 12), new MeshBasicMaterial({
            color: config.color,
            side: DoubleSide,
            transparent: false,
            depthTest: false,
            depthWrite: false,
            visible: true
        }));
        this.defaultPointerMesh.raycast = () => {
        };
        this.addObject(this.defaultPointerMesh, null, this.pointerContainer);
    }

    // disposes the whole pointerContainer, so to set the pointer to default use resetDefaultPointer()
    setCustomPointer(object: Object3D) {
        this.clearPointerContainer();
        this.pointerContainer.add(object);
        this.currentCustomPointer = object;
        this.currentCustomPointer.traverse((el) => {
            el.raycast && (el.raycast = () => {
            });
        });
    }

    // use this method on move update according to source
    updatePointer(ray: Ray) {
        this.setRay(ray);
        // this.raycaster.set(ray.origin.clone(), ray.direction.clone());
        const intersects = this.raycaster.intersectObject(this.scene, true);


        if (intersects.length === 0 || intersects[0].distance > this.maxDistance || intersects[0].distance < this.minDistance) {
            this.pointerContainer.position.z = this.lastDistance;
        } else {
            // alert('intersects');
            this.lastDistance = intersects[0].distance;
            this.pointerContainer.position.z = this.lastDistance;
        }
        this.update();
    }

    update() {
        this.camera.updateMatrixWorld(true);
        this.uiObject.updateMatrixWorld(true);
        this.pointerContainer.updateMatrixWorld(true);
        // if (this.pointerContainer['oldMatrix']) {
        //     const m = new Matrix4().multiplyMatrices(new Matrix4().getInverse(this.pointerContainer.matrixWorld.clone()), this.pointerContainer['oldMatrix'].clone());
        //
        //     this.pointerContainer.rotation.setFromRotationMatrix(m);
        //     this.pointerContainer.updateMatrixWorld(true);
        // }
    }

    clearPointerContainer() {
        this.pointerContainer.traverse((el) => {
            if (el !== this.pointerContainer) {
                if (el instanceof Mesh) {
                    el.geometry && el.geometry.dispose();
                    // @ts-ignore
                    el.material && el.material.map && el.material.map.dispose();
                    // @ts-ignore
                    el.material && el.material.dispose();
                }
            }
        });

        while (this.pointerContainer.children.length !== 0) {
            this.pointerContainer.remove(this.pointerContainer.children[0]);
        }
    }

    private setRay(ray: Ray) {
        this.raycaster.ray.copy(ray);
        this.pointerContainer.updateMatrixWorld(true);
        this.pointerContainer.lookAt(this.pointerContainer.localToWorld(new Vector3()).add(ray.direction));
    }
}
