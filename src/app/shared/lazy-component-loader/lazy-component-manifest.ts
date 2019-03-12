import {InjectionToken} from '@angular/core';

export const LAZY_COMPONENT = new InjectionToken<any>('LAZY_COMPONENT');
export const LAZY_MODULE = new InjectionToken<any>('LAZY_MODULE');
export const LAZY_COMPONENT_MANIFESTS = new InjectionToken<any>('LAZY_COMPONENT_MANIFESTS');

export interface LazyComponentManifest {
    componentId: string;
    path: string;
    loadChildren: string;
}
