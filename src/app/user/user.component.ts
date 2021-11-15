import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { TokenService } from '../token.service';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    private url = `https://jsramverk-editor-rahn20.azurewebsites.net/me-api`;
    //private url = `http://localhost:1337/me-api`;

    public userName: string = "";
    public allUsers: any = [];
    public allowedUsers: any = [];
    public docName: string = " ";
    public userEmail: string = "";

    private userId: string = "";
    private docId: string = "";
    private getUser: any = [];
    public token: string = "";
    private data: any;


    constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) { }

    ngOnInit(): void {
        this.getUserInfo();
        this.getAllUsers();
    }

    private getUserInfo() {
        this.tokenService.currentUser.subscribe(id => this.userId = id);
        this.tokenService.currentToken.subscribe(token => this.token = token);
        this.tokenService.currentUserEmail.subscribe(email => this.userEmail = email);
        this.tokenService.currentUserName.subscribe(name => this.userName = name);
        this.tokenService.currentDocID.subscribe(id => this.docId = id);
        this.tokenService.currentDocName.subscribe(name => this.docName = name);
    }

    showAllowedUsers() {
        this.allowedUsers = [];
        this.http.get(`${this.url}/users/${this.userId}`)
            .subscribe(response => {
                this.getUser = response;
                this.getUser.map((user: any) => {
                    user.docs.map((doc: any) =>{
                        if (doc._id === this.docId) {
                            if (doc.allowed_users) {
                                if (doc.allowed_users.length >= 1) {
                                    this.allowedUsers = doc.allowed_users;
                                } else {
                                    this.allowedUsers = ["None"]
                                }
                            } else {
                                this.allowedUsers = ["Du äger inte dokumentet."]
                            }
                        }
                    });
                });
            });
    }

    public getAllUsers() {
        this.allUsers = [];
        this.http.get(`${this.url}/users`)
            .subscribe(response => {
                this.getUser = response;
                this.getUser.map((user: any) => {
                    if(user._id !== this.userId) {
                        this.allUsers.push(user);
                    }
                });
            });
    }

    public allowUser(email: string) {
        let headers = { "x-access-token": this.token };
        let body = {
            email: email,
            doc_id: this.docId
        }

        this.http.put(`${this.url}/users/`, body, {headers})
            .subscribe(response => {
                this.data = response;
                
                if(this.data.FromUser) {
                    console.log("Från", this.data.FromUser, "till", this.data.ToUser);
                } else {
                    console.log("Error");
                    console.log(this.data);
                }
            });
    }

    public deleteUser() {
        let headers = { "x-access-token": this.token };

        this.http.delete(`${this.url}/users`, {headers})
            .subscribe(response => {
            });

        this.tokenService.changeToken("Token");
        this.router.navigateByUrl('/register');
    }

    public logOut() {
        this.tokenService.changeToken("Token");
        this.router.navigateByUrl('/login');
    }
}
