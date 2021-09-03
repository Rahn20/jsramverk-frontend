import { Component } from '@angular/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'frontend';

    saveResult() {
        let data = document.getElementById('editor-data')?.innerText;
        let removetext = data?.search("\n") ?? 0;

        console.log(data?.substring(removetext));
    }
}
