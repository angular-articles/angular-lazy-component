import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LazyComponentLoaderModule} from './shared/lazy-component-loader/lazy-component-loader.module';
import {LazyComponentManifest} from './shared/lazy-component-loader/lazy-component-manifest';

const manifests: LazyComponentManifest[] = [
    {componentId: 'example', path: 'example', loadChildren: './example/example.module#ExampleModule'}
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LazyComponentLoaderModule.forRoot(manifests)
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {
}
