import {TestBed} from '@angular/core/testing';

import {LazyComponentLoaderService} from './lazy-component-loader.service';

describe('LazyComponentLoaderService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: LazyComponentLoaderService = TestBed.get(LazyComponentLoaderService);
        expect(service).toBeTruthy();
    });
});
