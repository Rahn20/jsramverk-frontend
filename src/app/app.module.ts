import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CkeditorComponent } from './ckeditor/ckeditor.component';

import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

//const config: SocketIoConfig = { url: 'http://localhost:1337', options: {}};
const config: SocketIoConfig = { 
    url: 'https://jsramverk-editor-rahn20.azurewebsites.net', 
    options: {
        transports: ['websocket'],
    },
};

@NgModule({
    declarations: [
        AppComponent,
        CkeditorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        CKEditorModule,
        HttpClientModule,
        SocketIoModule.forRoot(config)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
