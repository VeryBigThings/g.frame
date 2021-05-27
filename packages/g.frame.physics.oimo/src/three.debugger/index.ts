import {BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial} from 'three';
import {oimo} from 'oimophysics';
import DebugDraw = oimo.dynamics.common.DebugDraw;
import Vec3 = oimo.common.Vec3;


export const lines = new LineSegments(new BufferGeometry(), new LineBasicMaterial({vertexColors: true}));

export const triangles = new Mesh(new BufferGeometry(), new MeshBasicMaterial({
    wireframe: false,
    vertexColors: true
}));

let linesBufferGeometry_position_array = [];
let linesBufferGeometry_color_array = [];
let trianglesGeometry_position_array = [];
let trianglesGeometry_normal_array = [];
let trianglesGeometry_color_array = [];

DebugDraw.prototype.triangle = function (v1: Vec3, v2: Vec3, v3: Vec3, n1: Vec3, n2: Vec3, n3: Vec3, color: Vec3) {
    trianglesGeometry_position_array.push(v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z);

    trianglesGeometry_normal_array.push(n1.x, n1.y, n1.z,
        n2.x, n2.y, n2.z,
        n3.x, n3.y, n3.z);

    trianglesGeometry_color_array.push(color.x, color.y, color.z,
        color.x, color.y, color.z,
        color.x, color.y, color.z);
};


DebugDraw.prototype.line = function (v1: Vec3, v2: Vec3, color: Vec3) {
    linesBufferGeometry_position_array.push(v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z);
    linesBufferGeometry_color_array.push(color.x, color.y, color.z,
        color.x, color.y, color.z);
};

export function beforeRender() {
    const linesBufferGeometry = new BufferGeometry();
    linesBufferGeometry.setAttribute('position', new BufferAttribute(new Float32Array(linesBufferGeometry_position_array), 3));
    linesBufferGeometry.setAttribute('color', new BufferAttribute(new Float32Array(linesBufferGeometry_color_array), 3));

    lines.geometry.dispose();
    lines.geometry = linesBufferGeometry;


    const trianglesGeometry = new BufferGeometry();
    trianglesGeometry.setAttribute('position', new BufferAttribute(new Float32Array(trianglesGeometry_position_array), 3));
    trianglesGeometry.setAttribute('normal', new BufferAttribute(new Float32Array(trianglesGeometry_normal_array), 3));
    trianglesGeometry.setAttribute('color', new BufferAttribute(new Float32Array(trianglesGeometry_color_array), 3));
    triangles.geometry.dispose();
    triangles.geometry = trianglesGeometry;
}

export function afterRender() {
    linesBufferGeometry_position_array = [];
    linesBufferGeometry_color_array = [];
    trianglesGeometry_position_array = [];
    trianglesGeometry_normal_array = [];
    trianglesGeometry_color_array = [];
}
