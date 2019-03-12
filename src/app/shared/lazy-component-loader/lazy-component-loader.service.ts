import {
    ComponentFactory,
    ComponentRef,
    Inject,
    Injectable,
    Injector,
    NgModuleFactory,
    NgModuleFactoryLoader,
    ViewContainerRef
} from '@angular/core';
import {from, Observable, of, throwError} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

import {LAZY_COMPONENT_MANIFESTS, LAZY_COMPONENT, LAZY_MODULE} from './lazy-component-manifest';
import {LazyComponentManifest} from './lazy-component-manifest';

@Injectable({
    providedIn: 'root'
})

export class LazyComponentLoaderService {
    lazyComponents: Map<string, any>;

    constructor(
        @Inject(LAZY_COMPONENT_MANIFESTS)
        private manifests: LazyComponentManifest[],
        private loader: NgModuleFactoryLoader,
        private injector: Injector
    ) {
        this.lazyComponents = new Map();
    }

    getComponentFactory<T>(componentId: string, injector?: Injector): Observable<ComponentFactory<T>> {
        const manifest = this.manifests.find(m => m.componentId === componentId);

        if (!manifest) {
            return throwError(
                `LazyComponentLoader: Unknown componentId "${componentId}"`
            );
        }

        const path = manifest.loadChildren;
        const p = this.load<T>(path, componentId, injector);

        return from(p);
    }

    load<T>(path: string, componentId: string, injector?: Injector): Promise<ComponentFactory<T>> {
        return this.loader
            .load(path)
            .then(ngModuleFactory =>
                this.loadFactory<T>(ngModuleFactory, componentId, injector)
            );
    }

    loadFactory<T>(ngModuleFactory: NgModuleFactory<any>, componentId: string, injector?: Injector): Promise<ComponentFactory<T>> {
        const moduleRef = ngModuleFactory.create(injector || this.injector);
        const lazyComponentType = moduleRef.injector.get(LAZY_COMPONENT, null);

        if (!lazyComponentType) {
            const lazyModule: LazyComponentManifest = moduleRef.injector.get(LAZY_MODULE, null);

            if (!lazyModule) {
                throw new Error(
                    'LazyComponentLoader: Lazy module for' +
                    ` componentId "${componentId}" does not contain` +
                    ' LAZY_COMPONENT or LAZY_MODULE as a provider.'
                );
            }

            if (lazyModule.componentId !== componentId) {
                throw new Error(
                    'LazyComponentLoader: Lazy module for' +
                    `${componentId} does not match manifest.`
                );
            }

            const path = lazyModule.loadChildren;

            if (!path) {
                throw new Error(`${componentId} unknown!`);
            }

            return this.load<T>(path, componentId, injector);
        }

        return Promise.resolve(
            moduleRef.componentFactoryResolver.resolveComponentFactory<T>(
                lazyComponentType
            )
        );
    }

    createComponent(componentName: string, container: ViewContainerRef, multi: boolean = false): Observable<ComponentRef<any>> {
        if (!multi && this.lazyComponents.has(componentName)) {
            return throwError(`LazyComponentLoader: component "${componentName}" exists`);
        }

        if (!container) {
            return throwError(`LazyComponentLoader: container not set`);
        }

        return this.getComponentFactory<any>(componentName).pipe(
            mergeMap(componentFactory => {
                const component = container.createComponent(componentFactory);

                this.lazyComponents.set(componentName, component);
                component.changeDetectorRef.detectChanges();

                return of(component);
            })
        );
    }

    destroyComponent(componentName: string): void {
        if (!this.lazyComponents.has(componentName)) {
            throw new Error(`LazyComponentLoader: component ${componentName} not fount`);
        }

        this.lazyComponents.get(componentName).destroy();
        this.lazyComponents.delete(componentName);
    }

    getComponent(componentName: string): ComponentRef<any> {
        return this.lazyComponents.get(componentName);
    }
}
