import {ResourcesManager} from '../ResourcesManager';
import AudiosLoader from './AudiosLoader';
import PositionalAudiosLoader from './PositionalAudiosLoader';
import FontsLoader from './FontsLoader';
import ModelsLoader from './ModelsLoader';
import TexturesLoader from './TexturesLoader';
import VideosLoader from './VideosLoader';

export * from './AudiosLoader';
export * from './PositionalAudiosLoader';
export * from './FontsLoader';
export * from './ModelsLoader';
export * from './TexturesLoader';
export * from './VideosLoader';

export function addDefaultLoaders(resourcesManager: ResourcesManager) {
    [AudiosLoader, PositionalAudiosLoader, FontsLoader, ModelsLoader, TexturesLoader, VideosLoader]
        .forEach(loaderConstructor => {
            resourcesManager.addLoader(new loaderConstructor());
        });
}