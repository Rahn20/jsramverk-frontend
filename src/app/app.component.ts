import { Component } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { TokenService } from './token.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent{
    public Editor = ClassicEditor;
    public title = 'Frontend';
    public showEditor = false;
    public showNav = true;
    public token: string = "";

    constructor(private tokenService: TokenService) {
    }

    ngOnInit(): void {
        this.tokenService.currentToken.subscribe(token => this.token = token);

        if (window.location.pathname === "/login" || window.location.pathname === "/register") {
            this.showEditor = false;
            this.showNav = false;
        } else {
            this.showNav = true;
            this.showEditor = true;
        }
    }
}
