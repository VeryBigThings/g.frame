import {Loader} from '../../../src';

const testLoader = new Loader<any>('type1');

describe('Resource Loader testing', () => {
    test('Checking that "addRaw" resource adds new resource to resourceRaw Array in the Loader class', () => {
        expect(testLoader.addResources([{
            name: 'test1',
            url: '../../assets/images/icons.png',
            type: 'type1'
        }])).toBe(true);
    });
    test('Checking that adding raw resource does not work with wrong resource type', () => {
        expect(testLoader.addResources([{
            name: 'test2',
            url: '../../assets/images/icons.png',
            type: 'definitely_wrong_type'
        }])).toBe(false);
    });
});

