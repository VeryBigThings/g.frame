describe('Base test', () => {
    test('Checking that new test file is using', () => {
        expect(1).toBe(1);
    });
});

// import ResourcesManagerClass, {
//     FontsLoader,
//     LocalAudioLoader,
//     ModelsLoader,
//     PositionalAudioLoader,
//     TexturesLoader, VideoLoader
// } from '../../../src/loaders/ResourcesManager';
//
// const ResourcesManager = new ResourcesManagerClass();
// ResourcesManager.addLoader(new ModelsLoader);
// ResourcesManager.addLoader(new FontsLoader);
// // ResourcesManager.addLoader(new HDRCubeTexturesLoader);
// ResourcesManager.addLoader(new LocalAudioLoader);
// ResourcesManager.addLoader(new PositionalAudioLoader);
// ResourcesManager.addLoader(new VideoLoader);
//
// declare function require(s: string): string;
//
// describe('Resource Manager testing', () => {
//     test('Checking that adding loader with new loader type returns true', () => {
//         expect(ResourcesManager.addLoader(new TexturesLoader)).toBe(true);
//     });
//     test('Checking that adding loader with same type returns false', () => {
//         expect(ResourcesManager.addLoader(new TexturesLoader)).toBe(false);
//     });
//     test('Checking that TexturesLoader is working', () => {
//         expect(ResourcesManager.addLoadResources([{
//             name: 'test_texture',
//             url: require('../docs/assets/images/icons.png'),
//             type: 'texture'
//         }])).toBe(true);
//     });
//     test('Checking that TexturesLoader is not adding if resource type does not exists', () => {
//         expect(ResourcesManager.addLoadResources([{
//             name: 'test_texture2',
//             url: require('../docs/assets/images/icons.png'),
//             type: 'not_texture'
//         }])).toBe(false);
//     });
//     test('Checking that load of all Loaders is working', () => {
//         expect(ResourcesManager.loadAll()).toBe(true);
//     });
//     test('Checking that ModelsLoader is working', () => {
//         expect(1).toBe(1);
//     });
//     test('Checking that FontsLoader is working', () => {
//         expect(1).toBe(1);
//     });
//     // test('Checking that HDRCubeTexturesLoader is working', () => {
//     //     expect(1).toBe(1);
//     // });
//     test('Checking that AudioLoader is working', () => {
//         expect(1).toBe(1);
//     });
//     test('Checking that PositionalAudioLoader is working', () => {
//         expect(1).toBe(1);
//     });
// });
//
