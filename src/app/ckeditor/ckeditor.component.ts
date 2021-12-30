import { Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HttpHeaders } from '@angular/common/http';

//editor 
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// sockets
import { Socket } from 'ngx-socket-io';

// token
import { TokenService } from '../token.service';

// graphql
import { Subscription } from 'rxjs';
import { Apollo, QueryRef, gql } from 'apollo-angular';

//interface
import { Data, Document } from './model.data';

//pdf
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
    selector: 'app-ckeditor',
    templateUrl: './ckeditor.component.html',
    styleUrls: ['./ckeditor.component.scss']
})

@Injectable({ providedIn: 'root' })
export class CkeditorComponent implements OnInit, OnDestroy {
    public Editor = ClassicEditor;
    public data: any = [];
    public getDocResult: string = "";
    public header: string = "Frontend";

    private onChangeData: string = "";
    private docId: string = "";

    public token: string = "";
    public userId: string = "";

    public querySubscription: any = Subscription;
    private postsQuery: any =  QueryRef;

    constructor(private socket:Socket, private tokenService: TokenService, private apollo: Apollo) {}

    ngOnInit(): void {
        (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

        this.tokenService.currentToken.subscribe(token => this.token = token);
        this.tokenService.currentUser.subscribe(id => this.userId = id);

        this.getUserDocs();
    }

    ngOnDestroy() {
        this.querySubscription.unsubscribe();
    }

    private sendDocUpdateSocket() { 
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

    public generatePDF() {
        let html = htmlToPdfmake(`<h1> ${this.header}</h1> ${this.getDocResult}`);
        let content = {content:html};

        pdfMake.createPdf(content).open();
    }


    public onKey(event: any) {
        this.sendDocUpdateSocket();
    }

    public clickDoc() {
        this.sendDocUpdateSocket();
    }

    public onChange({ editor }: ChangeEvent) {
        this.onChangeData = editor.getData();

        this.data.map( (res: { [x: string]: string; }) => {
            if (this.docId === res["_id"]) {
                if (this.getDocResult === res['content']) {
                    this.socket.emit('create', this.docId);
                    this.sendDocUpdateSocket();
                }
            }
        });
    }

    public refresh() {
        this.postsQuery.refetch();
    }

    public getUserDocs () {
        this.data = [];
        this.postsQuery = this.apollo.watchQuery<Document>({
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
            this.apollo.mutate<Data>({
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
                this.refresh();
            });
        } else {
            console.log("Du måste skriva dokument namn och innehåll");
        }
    }

    public update() {
        this.apollo.mutate<Data>({
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
            this.refresh();
        });
    }

    public delete() {
        this.apollo.mutate<Data>({
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
            this.refresh();
        });
    }
}

