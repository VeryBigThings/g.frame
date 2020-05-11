import {Box3, Object3D, Vector3} from 'three';

export class ObjectsPositioning {
    /**
     * Function sets objects positions that way, so objects are wrapped in column or row
     * @param {Array<Object3D>} objects Objects to wrap
     * @param {Boolean} horizontal Objects needed to wrap horizontally?
     * @param {Number} spaceBetween Margin between objects
     * @param {Number} [maxAdjustedSize = veryBigNumber] Maximum size to adjust, if adjusted size is bigger, will be used next line or column
     */
    public static adjustObjects(objects: Array<Object3D>, horizontal: boolean, spaceBetween: number, maxAdjustedSize: number = 9999999999999) {

        const objectSizes = objects.map(object => {
            const size = new Vector3();
            new Box3().setFromObject(object).getSize(size);
            return size;
        });
        const groups = [];
        let currentGroup;
        for (let i = 0; i < objects.length; i++) {
            currentGroup = currentGroup || [];
            let objectSize = objectSizes[i];
            let currentGroupSize = new Vector3();
            currentGroup.forEach((obj, j, arr) => {
                const size = new Vector3();
                new Box3().setFromObject(obj).getSize(size);
                currentGroupSize.add(size);
                if (j !== (arr.length - 1)) currentGroupSize.add(new Vector3(spaceBetween, spaceBetween, 0));
            });
            const adjustGroup = () => {
                let needSize = (horizontal ? currentGroupSize.x : currentGroupSize.y);
                const objectSizes = currentGroup.map(object => {
                    const size = new Vector3();
                    new Box3().setFromObject(object).getSize(size);
                    return size;
                });
                let usedDistance = -needSize / 2 - spaceBetween;

                let lastGroupsSize = new Vector3();
                let lastGroupsBox = new Box3();
                groups.forEach(group => group.forEach(obj => lastGroupsBox.expandByObject(obj)));
                if (!groups.length) {
                    lastGroupsBox.max.set(0, 0, 0);
                    lastGroupsBox.min.set(0, 0, 0);
                }
                lastGroupsBox.getSize(lastGroupsSize);
                currentGroup.forEach((object, j) => {
                    object.position[horizontal ? 'x' : 'y'] = usedDistance + (horizontal ? objectSizes[j].x : objectSizes[j].y) / 2 + spaceBetween;
                    object.position[horizontal ? 'y' : 'x'] = -lastGroupsSize[horizontal ? 'y' : 'x'] - (groups.length !== 0 ? spaceBetween : 0) - (horizontal ? objectSizes[j].y : objectSizes[j].x) / 2;
                    usedDistance += (horizontal ? objectSizes[j].x : objectSizes[j].y) + spaceBetween;
                });
                groups.push(currentGroup);
            };
            if ((horizontal ? objectSize.x : objectSize.y) +
                spaceBetween +
                (horizontal ? currentGroupSize.x : currentGroupSize.y) > maxAdjustedSize && (groups.length || currentGroup.length)) {

                adjustGroup();
                currentGroup = [objects[i]];

            } else {
                currentGroup.push(objects[i]);
            }
            if (i === objects.length - 1) {
                objectSize = objectSizes[i];
                currentGroupSize = new Vector3();
                currentGroup.forEach((obj, j, arr) => {
                    const size = new Vector3();
                    new Box3().setFromObject(obj).getSize(size);
                    currentGroupSize.add(size);
                    if (j !== arr.length - 1) currentGroupSize.add(new Vector3(spaceBetween, spaceBetween, 0));
                });
                adjustGroup();
            }
        }

        const groupBox = new Box3();
        groups.forEach(group => group.forEach(obj => groupBox.expandByObject(obj)));
        const size = new Vector3();
        groupBox.getSize(size);
        groups.forEach(group => group.forEach(obj => obj.position[horizontal ? 'y' : 'x'] += size[horizontal ? 'y' : 'x'] / 2));
    }
}