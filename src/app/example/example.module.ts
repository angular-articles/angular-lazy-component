import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {LazyComponentLoaderModule} from '../shared/lazy-component-loader/lazy-component-loader.module';
import {ExampleComponent} from './example.component';

@NgModule({
    declarations: [
        ExampleComponent
    ],
    imports: [
        CommonModule,
        LazyComponentLoaderModule.forChild(ExampleComponent)
    ]
})

export class ExampleModule {
}
