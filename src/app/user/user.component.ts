import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// token
import { TokenService } from '../token.service';

// graphql
import { Subscription } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
    public userName: string = "";
    public allUsers: any = [];
    public allowedUsers: any = [];
    public docName: string = " ";
    public userEmail: string = "";

    private userId: string = "";
    private docId: string = "";
    public token: string = "";

    private querySubscription: any = Subscription;
    postsQuery: any =  QueryRef;

    constructor(private tokenService: TokenService, private router: Router, private apollo: Apollo) { }

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

    ngOnDestroy() {
        this.querySubscription.unsubscribe();
    }

    
    refresh() {
        this.postsQuery.refetch();
    }

    showAllowedUsers() {
        this.apollo.watchQuery({
            query: gql`
                query {
                    user (_id: "${this.userId}") {
                        _id
                        name
                        email
                        docs {
                            _id
                            allowed_users
                        }
                    }
                }
            `,
        }).valueChanges
            .subscribe((data: any) => {
                this.refresh();
                (data.data.user[0].docs).map((doc: any) => {
                    if (doc._id === this.docId) {
                        this.allowedUsers = doc.allowed_users;
                    }
                });
        });
    }

    public getAllUsers() {
        this.allUsers = [];
        this.postsQuery = this.apollo.watchQuery({
            query: gql`
                query {
                    getUsers {
                        _id
                        name
                        email
                    }
                }
            `,
        });
        this.querySubscription = this.postsQuery
            .valueChanges
            .subscribe((data: any) => {
                (data.data.getUsers).map((user: any) => {
                    if(user._id !== this.userId) {
                        this.allUsers.push(user);
                    }
                });
        });
    }

    public allowUser(email: string) {
        this.apollo.mutate ({
            mutation: gql`
                mutation {
                    allowUser(docId: "${this.docId}", email: "${email}") {
                        data
                    }
                }
            `,

            context: {
                headers: new HttpHeaders().set('x-access-token', this.token)
            },
        }).subscribe((data: any) => {
            console.log(data.data);
        });

        this.refresh();
    }

    public deleteUser() {
        this.apollo.mutate ({
            mutation: gql`
                mutation {
                    deleteUser {
                        data
                    }
                }
            `,

            context: {
                headers: new HttpHeaders().set('x-access-token', this.token)
            },
        }).subscribe((data: any) => {
            console.log(data.data);
        });

        this.refresh();
        this.tokenService.changeToken("Token");
        this.router.navigateByUrl('/register');
    }

    public logOut() {
        this.tokenService.changeToken("Token");
        this.router.navigateByUrl('/login');
    }
}
