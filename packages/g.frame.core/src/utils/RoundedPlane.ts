import {DoubleSide, ExtrudeGeometry, BufferGeometry, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Float32BufferAttribute} from 'three';

export interface IOptionsRoundedObject {
    width: number;
    height: number;
    depth?: number;
    r1?: number;
    r2?: number;
    r3?: number;
    r4?: number;
    radiusPriority?: boolean;
    color?: number;
}


export class RoundedPlane {

    static getRoundedPlane(options: IOptionsRoundedObject): Mesh {

        if (options.r1 === undefined) options.r1 = 0;
        if (options.color === undefined) options.color = 0xffffff;

        const roundedPlaneShape = RoundedPlane.getRoundedPlaneShape(options);

        const roundedGeom = new ShapeGeometry(roundedPlaneShape);

        // roundedGeom.faceVertexUvs[0].forEach((faceVertexUv) => {
        //     faceVertexUv.forEach((innerFaceVertexUv) => {
        //         innerFaceVertexUv.x = (innerFaceVertexUv.x + options.width / 2) / options.width;
        //         innerFaceVertexUv.y = (innerFaceVertexUv.y + options.height / 2) / options.height;
        //     });
        // });

        const uvAttribute = roundedGeom.getAttribute('uv');
        for (var i = 0; i < uvAttribute.count; i++) {
            var u = uvAttribute.getX(i);
            var v = uvAttribute.getY(i);
      
            u = (u + options.width / 2) / options.width;
            v = (v + options.height / 2) / options.height;
    
            uvAttribute.setXY(i, u, v);
        }

        uvAttribute.needsUpdate = true;

        const roundedPlane = new Mesh(
            roundedGeom,
            new MeshBasicMaterial({color: options.color, side: DoubleSide})
        );

        return roundedPlane;
    }

    static getRoundedBox(options: IOptionsRoundedObject): Mesh {

        if (options.depth === undefined) options.depth = options.height;

        const roundedPlaneShape = RoundedPlane.getRoundedPlaneShape(options);

        const roundedPlane = new Mesh(
            new ExtrudeGeometry(roundedPlaneShape, {
                depth: options.depth,
                bevelEnabled: true,
                bevelSegments: 0,
                steps: 1,
                bevelSize: 0,
                bevelThickness: 0
            }),
            new MeshBasicMaterial({color: options.color, side: DoubleSide})
        );

        return roundedPlane;
    }

    static getRoundedBoxGeometry(options: IOptionsRoundedObject): BufferGeometry {

        if (options.depth === undefined) options.depth = options.height;

        const roundedPlaneShape = RoundedPlane.getRoundedPlaneShape(options);

        const geometry = new ExtrudeGeometry(roundedPlaneShape, {
            depth: options.depth,
            bevelEnabled: true,
            bevelSegments: 0,
            steps: 1,
            bevelSize: 0,
            bevelThickness: 0
        });

        const uvAttribute = geometry.getAttribute('uv');
        for (var i = 0; i < uvAttribute.count; i++) {
            var u = uvAttribute.getX(i);
            var v = uvAttribute.getY(i);
      
            u = u / options.width + 0.5;
            v = v / options.height + 0.5;
    
            uvAttribute.setXY(i, u, v);
        }

        uvAttribute.needsUpdate = true;

        return geometry;
    }

    static getRoundedPlaneShape(options: IOptionsRoundedObject): Shape {
        const x = -options.width / 2;
        const y = options.height / 2;

        const roundedPlaneShape = new Shape();

        let maxAllowRadius = (options.width > options.height) ? options.height : options.width;

        let r1 = options.r1;
        let r2 = options.r2 !== null && options.r2 !== undefined ? options.r2 : options.r1;
        let r3 = options.r3 !== null && options.r3 !== undefined ? options.r3 : options.r1;
        let r4 = options.r4 !== null && options.r4 !== undefined ? options.r4 : options.r1;

        r1 = (r1 > maxAllowRadius) ? maxAllowRadius : r1;
        r2 = (r2 > maxAllowRadius) ? maxAllowRadius : r2;
        r3 = (r3 > maxAllowRadius) ? maxAllowRadius : r3;
        r4 = (r4 > maxAllowRadius) ? maxAllowRadius : r4;


        if (options.radiusPriority) {
            const minSide = Math.min(options.width, options.height);
            if (options.width < options.height) {
                options.width = options.height = minSide + 0.00001;
                r1 = (r1 > minSide / 2) ? minSide / 2 : r1;
                r2 = (r2 > minSide / 2) ? minSide / 2 : r2;
                r3 = (r3 > minSide / 2) ? minSide / 2 : r3;
                r4 = (r4 > minSide / 2) ? minSide / 2 : r4;
            }
        }


        const steps = 8;
        roundedPlaneShape.moveTo(x, y - r1);
        if (r1 > 0) {
            for (let i = 0; i <= steps; i++) {
                const Ox = x + r1;
                const Oy = y - r1;
                const currX = Ox + r1 * Math.cos((-180 + i * -90 / steps) * (Math.PI / 180));
                const currY = Oy + r1 * Math.sin((-180 + i * -90 / steps) * (Math.PI / 180));
                roundedPlaneShape.lineTo(currX, currY);
            }
        }
        roundedPlaneShape.lineTo(x + options.width - r2, y);
        if (r2 > 0) {
            for (let i = 0; i <= steps; i++) {
                const Ox = x + options.width - r2;
                const Oy = y - r2;
                const currX = Ox + r2 * Math.cos((-270 + i * -90 / steps) * (Math.PI / 180));
                const currY = Oy + r2 * Math.sin((-270 + i * -90 / steps) * (Math.PI / 180));
                roundedPlaneShape.lineTo(currX, currY);
            }
        }
        roundedPlaneShape.lineTo(x + options.width, y - options.height + r3);
        if (r3 > 0) {
            for (let i = 0; i <= steps; i++) {
                const Ox = x + options.width - r3;
                const Oy = y - options.height + r3;
                const currX = Ox + r3 * Math.cos((i * -90 / steps) * (Math.PI / 180));
                const currY = Oy + r3 * Math.sin((i * -90 / steps) * (Math.PI / 180));
                roundedPlaneShape.lineTo(currX, currY);
            }
        }
        roundedPlaneShape.lineTo(x + r4, y - options.height);
        if (r4 > 0) {
            for (let i = 0; i <= steps; i++) {
                const Ox = x + r4;
                const Oy = y - options.height + r4;
                const currX = Ox + r4 * Math.cos((-90 + i * -90 / steps) * (Math.PI / 180));
                const currY = Oy + r4 * Math.sin((-90 + i * -90 / steps) * (Math.PI / 180));
                roundedPlaneShape.lineTo(currX, currY);
            }
        }

        return roundedPlaneShape;
    }
}

