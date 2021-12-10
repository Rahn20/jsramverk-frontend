import { Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HttpHeaders } from '@angular/common/http';

// sockets
import { Socket } from 'ngx-socket-io';

// token
import { TokenService } from '../token.service';

// graphql
import { Subscription } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
    selector: 'app-ckeditor',
    templateUrl: './ckeditor.component.html',
    styleUrls: ['./ckeditor.component.scss']
})

@Injectable({ providedIn: 'root' })
export class CkeditorComponent implements OnInit, OnDestroy {
    public Editor = ClassicEditor;
    public data: any = [];
    public getDocResult= "";
    public header = "Frontend";

    onChangeData = "";
    docId = "";
    test = false;

    public token: string = "";
    private userId: string = "";

    private querySubscription: any = Subscription;
    postsQuery: any =  QueryRef;

    constructor(private socket:Socket, private tokenService: TokenService, private apollo: Apollo) {}

    ngOnInit(): void {
        this.tokenService.currentToken.subscribe(token => this.token = token);
        this.tokenService.currentUser.subscribe(id => this.userId = id);

        this.getUserDocs();
    }

    ngOnDestroy() {
        this.querySubscription.unsubscribe();
    }

    sendDocUpdate() { 
        let x = {
            _id: this.docId,
            name: this.header,
            content: this.onChangeData
        };

        this.socket.emit("doc", x);
        this.socket.on('doc', (data: any) => {
            this.getDocResult = data['content'];
        });
    }

    public onKey(event: any) {
        this.sendDocUpdate();
    }

    public clickDoc() {
        this.sendDocUpdate();
    }

    public onChange({ editor }: ChangeEvent) {
        this.onChangeData = editor.getData();

        this.data.map( (res: { [x: string]: string; }) => {
            if (this.docId === res["_id"]) {
                if (this.getDocResult === res['content']) {
                    this.socket.emit('create', this.docId);
                    this.sendDocUpdate();
                }
            }
        });
    }

    refresh() {
        this.postsQuery.refetch();
    }

    public reload () {
        this.refresh();
    }

    public getUserDocs () {
        this.data = [];
        this.postsQuery = this.apollo.watchQuery({
            query: gql`
                query {
                    userDocs(_id: "${this.userId}") {
                        _id
                        name
                        content
                    }
                }
            `,
            //pollInterval: 500,
        });
        this.querySubscription = this.postsQuery
            .valueChanges
            .subscribe((data: any) => {
                this.data = data.data.userDocs;
        });
    }

    public printDoc(id:string, name:string, content:string) {
        this.docId = id;
        this.header = name;
        this.getDocResult = content;

        this.refresh();
        this.tokenService.changeDocName(this.header);
        this.tokenService.changeDocId(this.docId);
    }

    public create() {
        let name = (<HTMLInputElement>document.getElementById("name-doc")).value;
    
        if (name && this.onChangeData) {
            this.apollo.mutate ({
                mutation: gql`
                    mutation {
                        addDoc(name: "${name}", content: "${this.onChangeData}") {
                            data
                        }
                    }
                `,
    
                context: {
                    headers: new HttpHeaders().set('x-access-token', this.token)
                },
            }).subscribe((data:any) => {
                this.test = true;
                this.refresh();
            });
        } else {
            console.log("Du måste skriva dokument namn och innehåll");
        }
    }

    public update() {
        this.test = false;
        this.apollo.mutate ({
            mutation: gql`
                mutation {
                    updateDoc(docId: "${this.docId}", content: "${this.getDocResult}") {
                        data
                    }
                }
            `,

            context: {
                headers: new HttpHeaders().set('x-access-token', this.token)
            },
        }).subscribe((data:any) => {
            this.test = true;
            this.refresh();
        });
    }

    public delete() {
        this.apollo.mutate ({
            mutation: gql`
                mutation {
                    deleteDoc(id: "${this.docId}") {
                        data
                    }
                }
            `,

            context: {
                headers: new HttpHeaders().set('x-access-token', this.token)
            },
        }).subscribe((data:any) => {
            this.test = true;
            this.refresh();
        });
    }
}

