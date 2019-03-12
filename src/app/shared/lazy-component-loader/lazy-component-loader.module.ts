import {
    ANALYZE_FOR_ENTRY_COMPONENTS,
    ModuleWithProviders,
    NgModule,
    NgModuleFactoryLoader,
    SystemJsNgModuleLoader,
    Type
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ROUTES} from '@angular/router';

import {LazyComponentManifest, LAZY_COMPONENT_MANIFESTS, LAZY_MODULE, LAZY_COMPONENT} from './lazy-component-manifest';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        {provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader}
    ]
})

export class LazyComponentLoaderModule {
    static forRoot(manifests: LazyComponentManifest[]): ModuleWithProviders {
        return {
            ngModule: LazyComponentLoaderModule,
            providers: [
                // provider for Angular CLI to analyze
                {provide: ROUTES, useValue: manifests, multi: true},
                {provide: LAZY_COMPONENT_MANIFESTS, useValue: manifests}
            ],
        };
    }

    static forModule(manifest: LazyComponentManifest): ModuleWithProviders {
        return {
            ngModule: LazyComponentLoaderModule,
            providers: [
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: manifest, multi: true},
                // provider for @angular/router to parse
                {provide: ROUTES, useValue: manifest, multi: true},
                // provider for DynamicComponentLoader to analyze
                {provide: LAZY_MODULE, useValue: manifest}
            ]
        };
    }

    static forChild(component: Type<any>): ModuleWithProviders {
        return {
            ngModule: LazyComponentLoaderModule,
            providers: [
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: component, multi: true},
                // provider for @angular/router to parse
                {provide: ROUTES, useValue: [], multi: true},
                // provider for DynamicComponentLoader to analyze
                {provide: LAZY_COMPONENT, useValue: component}
            ]
        };
    }
}
