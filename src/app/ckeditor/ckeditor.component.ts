import { Component, Injectable, OnInit} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HttpClient } from '@angular/common/http';


import { Data } from './model.testing.data';
import { Socket } from 'ngx-socket-io';
import { TokenService } from '../token.service';


@Component({
    selector: 'app-ckeditor',
    templateUrl: './ckeditor.component.html',
    styleUrls: ['./ckeditor.component.scss']
})

@Injectable({ providedIn: 'root' })
export class CkeditorComponent implements OnInit {
    public Editor = ClassicEditor;
    public data: any = [];
    public getDocResult= "";
    public header = "Frontend";
    private url = `https://jsramverk-editor-rahn20.azurewebsites.net/me-api`;
    //private url = `http://localhost:1337/me-api`;

    onChangeData = "";
    errorMessage: any;
    docId = "";
    getDoc: any = [];
    getUser: any = [];
    test = false;

    public token: string = "";
    private userId: string = "";

    constructor(private http: HttpClient, private socket:Socket, private tokenService: TokenService) {
    }

    ngOnInit(): void {
        this.tokenService.currentToken.subscribe(token => this.token = token);
        this.tokenService.currentUser.subscribe(id => this.userId = id);

        this.getUserDocs();
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

    public reload () {
        this.getUserDocs();
    }

    public getUserDocs () {
        this.data = [];
        this.http.get(`${this.url}/users/${this.userId}`)
            .subscribe(response => {
                this.getUser = response;
                this.getUser.map((user:any) => {
                    user.docs.map((doc: { _id: string; }) => {
                        this.specificDoc(doc._id);
                    });
                });
            });
    }

    getAllDocs () {
        this.data = [];
        this.http.get<Data[]>(this.url)
            .subscribe(response => {
                this.getDoc = response;
                this.getDoc.map((doc:any) => {
                    this.data.push(doc);
                });
            });
    }

    public printDoc(id:string, name:string, content:string) {
        this.docId = id;
        this.header = name;
        this.getDocResult = content;

        this.tokenService.changeDocName(this.header);
        this.tokenService.changeDocId(this.docId);
    }

    public delete() {
        let headers = { "x-access-token": this.token }

        this.http.delete<Data[]>(`${this.url}/delete/${this.docId}`, {headers})
            .subscribe({
                next: data => {
                    this.test = true;
                    this.getUserDocs();
                    console.log("Documentet har raderats.");
                },
                error: error => {
                    this.errorMessage = error.message;
                    console.error('There was an error!', error);
                }
            })
    }

    public update() {
        this.test = false;
        let headers = { "x-access-token": this.token }

        this.http.put<Data[]>(`${this.url}/update`, {_id: this.docId, content: this.getDocResult}, {headers})
            .subscribe({
                next: data => {
                    this.test = true;
                    this.getUserDocs();
                    console.log("Dokumentet har uppdaterats");
                },
                error: error => {
                    this.errorMessage = error.message;
                    console.error('There was an error!', error);
                }
            })
    }

    private specificDoc(id: string) {
        this.http.get<Data[]>(`${this.url}/document/${id}`)
            .subscribe({
                next: data => {
                    this.getDoc = data;
                    this.getDoc.map((doc:any) => {
                        this.data.push(doc);
                    });
                },
                error: error => {
                    this.errorMessage = error.message;
                    console.error('There was an error!', error);
                }
            });
    }

    public create() {
        let name = (<HTMLInputElement>document.getElementById("name-doc")).value;
        let headers = { "x-access-token": this.token }
        let body = {
            "name": name,
            "content": this.onChangeData 
        }
    
        if (name && this.onChangeData) {
            this.http.post<Data[]>(`${this.url}/create`, body, {headers})
            .subscribe({
                next: data => {
                    this.test = true;
                    this.getUserDocs();
                    console.log("Nytt dokument har skapats.");
                },
                error: error => {
                    this.errorMessage = error.message;
                    console.error('There was an error!', error);
                }
            })
        } else {
            console.log("Du måste skriva dokument namn och innehåll");
        }

    }

    reset() {
        this.data = [];

        this.http.get<Data[]>(`${this.url}/reset`)
            .subscribe({
                next: Response => {
                    this.getDoc = Response;
                    this.test = true;
                    this.getUserDocs();
                },
                error: error => {
                    this.errorMessage = error.message;
                    console.error('There was an error!', error);
                }
            });
    }
}

