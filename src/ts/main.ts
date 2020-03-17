// // import {EventDispatcher} from '../../../../Documents/projects/additional_repos/vbt-webvr-framework/src/ts/actions/EventDispatcher';
// // import {IConfig} from '../../../../Documents/projects/additional_repos/vbt-webvr-framework/src/ts/interfaces/Config_interfaces';
// // import {ViewerModule} from '../../../../Documents/projects/additional_repos/vbt-webvr-framework/src/ts/core/ViewerModule';

// // import {MeshEventDispatcher} from '../../../../Documents/projects/additional_repos/vbt-webvr-framework/src/ts/actions/MeshEventDispatcher';
// // import {ParentEvent} from '../../../../Documents/projects/additional_repos/vbt-webvr-framework/src/ts/actions/ParentEvent';





// const object = {
//     function1: ()=>{},
//     function2: ()=>{},
//     function3: ()=>{},
// }
// const object2 = {
//     function1: ()=>{},
//     function2: ()=>{},
//     function3: ()=>{},
// }

// function createUniversalAgent<T>(instances: Array<T>): any{
//     const agent = {};
//     for(let key in object)
//     {
//         if(object[key] instanceof Function)
//         {
//             agent[key] =  () => {
//                 for (let instance of instances)
//                 {
//                     instance[key].call(instance, ...arguments);
//                 }
//             }
//         }
//     }
//     return agent;
// }

// function createMeshEventDispatcher_Agent(instances: Array<MeshEventDispatcher>) {
//     return {
//         on: (eventName: string, mesh, callback1: Function, callback2?: Function) => {
//             for (let instance of instances)
//                 instance.on.call(instance, ...arguments);
//         },
//         once: (eventName: string, mesh, callback1: Function, callback2?: Function) => {
//             for (let instance of instances)
//                 instance.on.call(instance, ...arguments);
//         },
//         off: (eventName?: string, mesh?: Object3D, callback?: Function) => {
//             for (let instance of instances)
//                 instance.on.call(instance, ...arguments);
//         },
//         fire: (eventName?: string, mesh?: Object3D, data: ParentEvent = new ParentEvent('')) => {
//             for (let instance of instances)
//                 instance.on.call(instance, ...arguments);
//         },
//     };
// }