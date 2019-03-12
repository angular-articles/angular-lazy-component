import {Component, ViewChild, ViewContainerRef} from '@angular/core';

import {LazyComponentLoaderService} from './shared/lazy-component-loader/lazy-component-loader.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    title = 'angular-lazy-component';
    @ViewChild('authOutlet', {read: ViewContainerRef}) authOutlet: ViewContainerRef | undefined;

    constructor(private lazyComponentLoader: LazyComponentLoaderService) {
    }

    loadComponent(componentName): void {
        const component = this.lazyComponentLoader.getComponent(componentName);

        if (component) {
            component.instance.isOpen = true;
        } else {
            this.lazyComponentLoader.createComponent(componentName, this.authOutlet).subscribe(comp => {
                comp.instance.isOpen = true;
            });
        }
    }

    destroyComponent(componentName) {
        this.lazyComponentLoader.destroyComponent(componentName);
    }
}
