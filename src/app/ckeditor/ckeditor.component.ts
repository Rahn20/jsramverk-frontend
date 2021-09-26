import { Component, OnInit} from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-ckeditor',
    templateUrl: './ckeditor.component.html',
    styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit {
    public Editor = ClassicEditor;
    public data: any = [];
    public getDocResult= "";
    public header = "Frontend";

    url = `https://jsramverk-editor-rahn20.azurewebsites.net/me-api`;

    onChangeData = "";
    errorMessage: any;
    docId = "";
    getDoc: any = [];

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.getAllDocs();
    }

    public onChange({ editor }: ChangeEvent) {
        this.onChangeData = editor.getData();
    }

    getAllDocs () {
        this.data = [];
        this.http.get(this.url)
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
        this.http.put(`${this.url}/update/${this.docId}`, {name: this.header, content: this.getDocResult})
            .subscribe({
                next: data => {
                    this.getAllDocs();
                    console.log("Dokumentet har uppdaterats");
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
            this.http.post(`${this.url}/create`, body)
            .subscribe({
                next: data => {
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

        this.http.get(`${this.url}/reset`)
            .subscribe({
                next: Response => {
                    this.getDoc = Response;
                    let res = this.getDoc[0];

                    this.printDoc(res.id, res.name, res.content);
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
}
