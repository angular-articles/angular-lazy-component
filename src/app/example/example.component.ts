import {Component} from '@angular/core';

@Component({
    selector: 'app-auth',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss']
})

export class ExampleComponent {
    public isOpen: boolean;

    constructor() {
    }

    onClose(): void {
        console.log('form closed');
        this.isOpen = false;
    }

    onSubmit(): void {
        // do something...
        console.log('form submitted');
        this.isOpen = false;
    }

    // noinspection JSMethodCanBeStatic
    onClickBody(event: MouseEvent): void {
        event.stopPropagation();
    }
}
