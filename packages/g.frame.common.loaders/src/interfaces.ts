/** this Interface is used for creating new Resources and mark loaded
 * @param name string should be unique for every Loader, used to get a resource from the loader
 * @param url string is path or url for the resource file. FILE EXTENSION SHOULD SUPPORTED BY THE LOADER.
 * @param loaded boolean refers for the loading state. Once loaded (true) resource can be got
 * @param type string refers to Loader purposes (can be audio|model|font| or any custom)
 */

export interface ResourceRaw {
    name: string;
    url: string | Array<string>;
    loaded?: boolean;
    type: string;
    crossOrigin?: string;
}