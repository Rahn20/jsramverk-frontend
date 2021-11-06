import { Component, Injectable, OnInit} from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import { HttpClient } from '@angular/common/http';
import { Data } from './model.testing.data';
import { Socket } from 'ngx-socket-io';


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

    url = `https://jsramverk-editor-rahn20.azurewebsites.net/me-api`;
    //url = `http://localhost:1337/me-api`;

    onChangeData = "";
    errorMessage: any;
    docId = "";
    getDoc: any = [];
    test = false;

    constructor(private http: HttpClient, private socket:Socket) {}

    ngOnInit(): void {
        this.getAllDocs();
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
    }

    public update() {
        this.test = false;
        this.http.put<Data[]>(`${this.url}/update/${this.docId}`, {name: this.header, content: this.getDocResult})
            .subscribe({
                next: data => {
                    this.test = true;
                    this.getAllDocs();
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
                    this.printDoc(data[0]['_id'], data[0]['name'], data[0]['content']);
                },
                error: error => {
                    this.errorMessage = error.message;
                    console.error('There was an error!', error);
                }
            })
    }

    public create() {
        let name = (<HTMLInputElement>document.getElementById("name-doc")).value;

        let body = {
            "name": name,
            "content": this.onChangeData 
        }
    
        if (name && this.onChangeData) {
            this.http.post<Data[]>(`${this.url}/create`, body)
            .subscribe({
                next: data => {
                    this.test = true;
                    this.getAllDocs();
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

    public reset() {
        this.data = [];

        this.http.get<Data[]>(`${this.url}/reset`)
            .subscribe({
                next: Response => {
                    this.getDoc = Response;
                    this.test = true;
                    this.getAllDocs();
                },
                error: error => {
                    this.errorMessage = error.message;
                    console.error('There was an error!', error);
                }
            });
    }
}

