import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    private url = `https://jsramverk-editor-rahn20.azurewebsites.net/me-api`;
    //private url = `http://localhost:1337/me-api`;

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {

    }

    public showPassword() {
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

    public register (name: string, email: string, password: string) {
        let body = {
            name: name,
            email: email,
            password: password
        }

        let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        let OK = regex.exec(password);

        if (email.includes("@") && OK && name) {
            this.http.post(`${this.url}/register`, body)
            .subscribe(response => {
                this.router.navigateByUrl('/login');
            });
        } else {
            console.log("Email eller lösenord är felaktigt!");
        }

    }
}
