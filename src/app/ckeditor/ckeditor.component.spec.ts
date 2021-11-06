import { TestBed } from '@angular/core/testing';

import { CkeditorComponent } from './ckeditor.component';

// Http testing module
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Data } from './model.testing.data';

// testing socket
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';


let testingData: Data[] = [
    {_id: "123456789", name: "Testing", content: "<p> Tesing Angular</p>"},
    {_id: "824629649264", name: "Testing 2", content: "<p> Tesing Angular 2</p>"}
];

const config: SocketIoConfig = { 
    url: 'https://jsramverk-editor-rahn20.azurewebsites.net', 
    options: {
        transports: ['websocket'],
    },
};

describe('CkeditorComponent', () => {
    let component: CkeditorComponent;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ CkeditorComponent ],
            imports: [ HttpClientTestingModule, SocketIoModule.forRoot(config) ]
            //providers: [ CkeditorComponent]
        })
        .compileComponents();

        component = TestBed.inject(CkeditorComponent);
        httpMock = TestBed.inject(HttpTestingController);
    });

    beforeEach(() => {
        component.getAllDocs();

        const req = httpMock.expectOne(component.url);

        req.flush(testingData);
        expect(req.request.method).toBe('GET');
        expect(component.data).toHaveSize(2);
        expect(component.data).toEqual(testingData);

        httpMock.verify();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('Should load/add the documents', () => {
        component.ngOnInit();
        const req = httpMock.expectOne(component.url);

        req.flush(testingData);
        expect(req.request.method).toBe('GET');
        expect(component.data).toHaveSize(2);
        expect(component.data).toEqual(testingData);

    });

    it('Tests the variables', () => {
        expect(component.data).toHaveSize(2);
        expect(component.docId).toBe("");
        expect(component.getDoc).toHaveSize(2);
        expect(component.getDocResult).toBe("");
        expect(component.onChangeData).toBe("");
        expect(component.test).toBe(false);
        expect(component.header).toEqual("Frontend");
        expect(component.url).toBe("https://jsramverk-editor-rahn20.azurewebsites.net/me-api");
    });

    it('Should restore the documents', () => {
        component.reset();
        const req = httpMock.expectOne(`${component.url}/reset`);
        
        req.flush(testingData[0]);
        expect(req.request.method).toBe('GET');
        expect(component.test).toBe(true);
    });


    it('Should update an axisting document', () => {
        component.docId = testingData[0]._id;
        component.header = "Update doc";
        component.getDocResult = "<p> Uppdating doc.</p>";

        component.update();
        const req = httpMock.expectOne(`${component.url}/update/${component.docId}`);
        
        req.flush({name:"Update doc", content:"<p> Uppdating doc </p>"});
        expect(req.request.method).toBe('PUT');
        expect(component.test).toBe(true);
    });


    it('Should view the entire document by clicking on the document name', () => {
        let doc = testingData[0];
    
        component.printDoc(doc['_id'], doc['name'], doc['content']);

        expect(component.header).toEqual(doc['name']);
        expect(component.docId).toEqual(doc['_id']);
        expect(component.getDocResult).toEqual(doc['content']);
        expect(component.test).toBe(false);
    });
});
