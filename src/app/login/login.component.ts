import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { TokenService } from '../token.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    private url = `https://jsramverk-editor-rahn20.azurewebsites.net/me-api`;
    //private url = `http://localhost:1337/me-api`;
    private getData: any = [];
    private token: string = "";


    constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) { }

    ngOnInit(): void {
        this.getToken();
    }

    public checkValid (email: string, password: string) {
        let body = { email: email, password: password }

        let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        let OK = regex.exec(password);

        if (email.includes("@") && OK) {
            this.login(body);
        } else {
            console.log("Email eller lösenord är felaktigt");
        }
    }

    showPassword() {
        let pass = (<HTMLInputElement>document.getElementById("password"));
        let button = (<HTMLButtonElement>document.getElementById("show"));

        if (button.value === "Visa") {
            pass.type = "text";
            button.value = "Gömma";
        } else {
            pass.type = "password";
            button.value = "Visa";
        }
    }

    private login(body: object) {
        this.http.post(`${this.url}/login`, body)
            .subscribe(response => {
                this.getData = response;
                this.token = this.getData.data.token;

                this.tokenService.changeToken(this.token);
                this.tokenService.changeUser(this.getData.data.userId);
                this.tokenService.changeUserName(this.getData.data.userName);
                this.tokenService.changeUserEmail(this.getData.data.user.email);
                this.router.navigateByUrl('/');
            });
    }

    getToken(): void {
        this.tokenService.currentToken
            .subscribe(token => this.token = token);
    }
}
