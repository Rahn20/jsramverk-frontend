import { Component, OnInit } from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
    selector: 'app-ckeditor',
    templateUrl: './ckeditor.component.html',
    styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit {
    public Editor = ClassicEditor;

    constructor() { }

    ngOnInit(): void {
    }
}
