import {Loader, ResourcesManager} from '../../../src/loaders';


const resourcesManager = new ResourcesManager();
const testLoader = new Loader<any>('type1');

describe('Resource Manager testing', () => {
    test('Checking that adding loader with new loader type returns true', () => {
        expect(resourcesManager.addLoader(testLoader)).toBe(true);
    });
    test('Checking that adding loader with same type returns false', () => {
        expect(resourcesManager.addLoader(new Loader<any>('type1'))).toBe(false);
    });
    test('Checking that adding loader with same type returns false', () => {
        expect(resourcesManager.getLoader('definitely_not_a_loader_type')).toBe(undefined);
    });
    test('Checking that getting loader returns loader by name', () => {
        expect(resourcesManager.getLoader('type1')).toBe(testLoader);
    });
});

describe('Resource Loader testing', () => {
    test('Checking that "addRaw" resource adds new resource to resourceRaw Array in the Loader class', () => {
        expect(testLoader.addRaw({
            name: 'test1',
            url: '../../assets/images/icons.png',
            type: 'type1'
        })).toBe(true);
    });
    test('Checking that adding raw resource does not work with wrong resource type', () => {
        expect(testLoader.addRaw({
            name: 'test2',
            url: '../../assets/images/icons.png',
            type: 'definitely_wrong_type'
        })).toBe(false);
    });
});

