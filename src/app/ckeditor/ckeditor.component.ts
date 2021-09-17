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
    public header = "";
    public getDocResult= "";
    public result = "";

    url = `https://jsramverk-editor-rahn20.azurewebsites.net/me-api`;
    getDoc: any = [];
    onChangeData = "";
    errorMessage: any;
    docId: any = [];

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.printDoc();
    }

    public printDoc() {
        this.header = "Visa Dokument";
        this.getDocResult = "";
        this.docId = [];
        this.result = "";

        this.http.get(this.url)
            .subscribe(response => {
                this.getDoc = response;
                this.getDoc.map((doc: any) => {
                    this.docId.push(doc['_id']);
                    this.getDocResult += `<p><b>namn: </b> ${doc['namn']}, <b>bor: </b> ${doc['bor']} </p>`
                });
            });
    }

    public onChange({ editor }: ChangeEvent) {
        this.onChangeData = editor.getData();
    }

    public create() {
        let save = document.getElementById('save');
        this.result = "";
        this.header = "Skapa dokument";
        this.getDocResult = `<p><b>namn:</b></p><p><b>bor:</b></p>`;

        saveButtonStyle("Spara", "#f2f2f2", "#009933", "pointer", "1rem");

        save?.addEventListener("click", function () {
            let doc = document.getElementById("editor-data")?.innerText;
            let removeName = doc?.search("namn:") ?? 0;
            let removeLocation = doc?.search("bor:") ?? 0;
            let body = {
                namn: doc?.substring(removeName + 5, removeLocation - 2),
                bor: doc?.substring(removeLocation + 4)
            }

            saveButtonStyle("", "none", "none", "none", "0");
            postDoc(body);
        });

        function saveButtonStyle(text: string, color: string, background: string, cursor: string, padding: string) {
            if (save) { 
                save.innerHTML = text;
                save.style.backgroundColor = background;
                save.style.padding = padding;
                save.style.color = color;
                save.style.cursor = cursor;
            }
        }

        const postDoc = (body: object) => {
            this.http.post(`${this.url}/create`, body)
                .subscribe({
                    next: data => {
                        this.result = "Nytt dokument har skapats.";
                        console.log("Nytt dokument har skapats.");
                        //console.log(data);
                    },
                    error: error => {
                        this.errorMessage = error.message;
                        console.error('There was an error!', error);
                    }
                });
        }
    }

    public update() {
        let updateDoc = this.onChangeData;
        let splitDoc = updateDoc.split("<h2>").join("").split("</h2>").join(" ").split("<h3>").join("").split("</h3>").join(" ").split("<h4>").join("").split("</h4>").join(" ");
        let splitDoc2 = splitDoc.split("<p>").join("").split("</p>").join(" ").split("<h1>").join("").split("</h1>").join(" ");
        let splitDoc3 = splitDoc2.split("</strong>").join("").split("<strong>").join("").split("<i>").join("").split("</i>").join("").split(":").join("");
        let splitDoc4 = splitDoc3.split("bor").join("").split("namn");

        for (let x = 1; x <= splitDoc4.length - 1; x++) {
            let s = splitDoc4[x].search(",");
            let name = splitDoc4[x].substring(0, s);
            let live = splitDoc4[x].substring(s + 1);
            let id = this.docId[x-1];

            //console.log("id " + id +  " namn: " + name + " bor:" + live);
            this.http.put(`${this.url}/update/${id}`, {namn: name, bor: live})
                .subscribe({
                    next: data => {
                        //console.log(data);
                    },
                    error: error => {
                        this.errorMessage = error.message;
                        console.error('There was an error!', error);
                    }
                });
        }
        console.log("Dokumentet har uppdaterats");
    }

    public reset() {
        this.header = "Visa Dokument";
        this.getDocResult = "";
        this.result = "";
        this.docId = [];

        this.http.get(`${this.url}/reset`)
            .subscribe(response => {
                this.getDoc = response;
                this.getDoc.map((doc: any) => {
                    this.docId.push(doc['_id']);
                    this.getDocResult += `<p><b>namn: </b> ${doc['namn']}, <b>bor: </b> ${doc['bor']} </p>`
                });
            });
    }
}

