import ResourcesManagerClass from '../../../src/loaders/ResourcesManager';
import FontsLoader from '../../../src/loaders/FontsLoader';
import ModelsLoader from '../../../src/loaders/ModelsLoader';
import VideoLoader from '../../../src/loaders/VideoLoader';
import TexturesLoader from '../../../src/loaders/TexturesLoader';
import AudiosLoader from '../../../src/loaders/AudiosLoader';
import {Object3D, Texture} from 'three';

const ResourcesManager = new ResourcesManagerClass();
ResourcesManager.addLoader(new ModelsLoader);
ResourcesManager.addLoader(new FontsLoader);
ResourcesManager.addLoader(new AudiosLoader);
// ResourcesManager.addLoader(new PositionalAudiosLoader);
ResourcesManager.addLoader(new VideoLoader);

describe('Resource Manager testing', () => {
    test('Checking that adding loader with new loader type returns true', () => {
        expect(ResourcesManager.addLoader(new TexturesLoader)).toBe(true);
    });
    test('Checking that adding loader with same type returns false', () => {
        expect(ResourcesManager.addLoader(new TexturesLoader)).toBe(false);
    });
    test('Checking that adding loader with same type returns false', () => {
        expect(ResourcesManager.getLoader('definitely_not_a_loader_type')).toBe(undefined);
    });
    test('Checking that ResourcesManager is working for one resource', () => {
        expect(ResourcesManager.addLoadResources([{
            name: 'test_texture',
            url: '../../assets/images/logo.png',
            type: 'texture'
        }])).toBe(true);
    });
    test('Checking that TexturesLoader is not adding if the resource type does not exists', () => {
        expect(ResourcesManager.addLoadResources([{
            name: 'test_texture2',
            url: '../../assets/images/logo.png',
            type: 'definitely_not_a_texture'
        }])).toBe(false);
    });
    test('Checking that TexturesLoader is working for couple of resources', () => {
        expect(ResourcesManager.addLoadResources([{
            name: 'test_model',
            url: '../../assets/models/arrow.fbx',
            type: 'model'
        }, {
            name: 'test_audio',
            url: '../../assets/sounds/failFx.mp3',
            type: 'audio'
        },
        ])).toBe(true);
    });
    test('Checking that TexturesLoader is not adding the resource type does not exists, but adding all other resources', () => {
        expect(ResourcesManager.addLoadResources([{
            name: 'test_video',
            url: '../../assets/videos/placeholder.mp4',
            type: 'video'
        }, {
            name: 'test_texture3',
            url: '....//assets/images/logo.png',
            type: 'definitely_not_a_texture'
        }, {
            name: 'test_audio2',
            url: '../../assets/sounds/failFx.mp3',
            type: 'audio'
        }, {
            name: 'test_positional_audio',
            url: '../../assets/sounds/failFx.mp3',
            type: 'positional_audio'
        },
        ])).toBe(false);
    });
    ResourcesManager.loadAll().then((result) => {

        test('Checking that load of all Loaders is working', () => {
            expect(result).toBe(true);
        });

        test('Checking that Texture Loader returns texture', () => {
            expect(ResourcesManager.getLoader('texture').getResource('test_texture')).toBeInstanceOf(Texture);
        });
        test('Checking that Texture Loader returns undefined on wrong resource name', () => {
            expect(ResourcesManager.getLoader('texture').getResource('definitely_not_a_texture')).toBe(undefined);
        });
        test('Checking that Texture Loader returns texture', () => {
            expect(ResourcesManager.getLoader('font').getResource('test_font')).toBeInstanceOf(Object);
        });
        test('Checking that Texture Loader returns undefined on wrong resource name', () => {
            expect(ResourcesManager.getLoader('font').getResource('definitely_not_a_font')).toBe(undefined);
        });
        test('Checking that Models Loader returns Object3D', () => {
            expect(ResourcesManager.getLoader('model').getResource('test_model')).toBeInstanceOf(Object3D);
        });
        test('Checking that Models Loader returns undefined on wrong resource name', () => {
            expect(ResourcesManager.getLoader('model').getResource('definitely_not_a_model')).toBe(undefined);
        });
        test('Checking that Audio Loader returns HTMLAudioElement', () => {
            expect(ResourcesManager.getLoader('audio').getResource('test_audio')).toBeInstanceOf(HTMLAudioElement);
        });
        test('Checking that Audio Loader returns undefined on wrong resource name', () => {
            expect(ResourcesManager.getLoader('audio').getResource('definitely_not_an_audio')).toBe(undefined);
        });
        // test('Checking that Positional Audio Loader returns THREE.PositionalAudio', () => {
        //     expect(ResourcesManager.getLoader('positional_audio').getResource('test_positional_audio')).toBeInstanceOf(PositionalAudio);
        // });
        test('Checking that Positional Audio Loader returns undefined on wrong resource name', () => {
            expect(ResourcesManager.getLoader('positional_audio').getResource('definitely_not_a_positional_audio')).toBe(undefined);
        });
        test('Checking that Video Loader returns HTMLVideoElement', () => {
            expect(ResourcesManager.getLoader('video').getResource('test_video')).toBeInstanceOf(HTMLVideoElement);
        });
        test('Checking that Video Loader returns undefined on wrong resource name', () => {
            expect(ResourcesManager.getLoader('video').getResource('definitely_not_a_video')).toBe(undefined);
        });

    })


});

