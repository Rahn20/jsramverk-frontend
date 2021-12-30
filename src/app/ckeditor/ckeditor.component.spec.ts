import { TestBed } from '@angular/core/testing';
import { CkeditorComponent } from './ckeditor.component';
import { Subscription } from 'rxjs';

// apollo testing module
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { Data, User, Document } from './model.data';

//service
import { TokenService } from 'app/token.service';

// testing socket
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

let testingDoc: Document[] = [
    {_id: "12345fdfere6789", name: "Testing 1", content: "<p> Testing Angular 1 </p>"},
    {_id: "8246296492gf64", name: "Testing 2", content: "<p> Testing Angular 2</p>"}
];

const config: SocketIoConfig = { 
    url: 'https://jsramverk-editor-rahn20.azurewebsites.net/me-api/graphql', 
    //url: 'http://localhost:1337/me-api/graphql', 
    options: {
        transports: ['websocket'],
    },
};

describe('CkeditorComponent', () => {
    let component: CkeditorComponent;
    let service: TokenService;
    let controller: ApolloTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ CkeditorComponent ],
            imports: [ ApolloTestingModule, SocketIoModule.forRoot(config) ],
            providers: [ TokenService ]
        })
        .compileComponents();

        service = TestBed.inject(TokenService);
        component = TestBed.inject(CkeditorComponent);
        controller = TestBed.inject(ApolloTestingController);
    });

    beforeEach(() => {
        controller.verify();

        // ngOnDestroy
        component.querySubscription = new Subscription();
        spyOn(component.querySubscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(component.querySubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('Should create the app', () => {
        expect(component).toBeTruthy();
    });


    it('Testing downloadPDF(), Should open the document as a PDF', () => {
        component.ngOnInit();
        component.header = "Testing PDF";
        component.getDocResult = "<p> Open document as a PDF </p>";

        expect(component.header).toBe('Testing PDF') ;
        expect(component.getDocResult).toBe('<p> Open document as a PDF </p>');
        component.generatePDF();
    });

    /*
    it('Should load/add the documents', () => {
        component.ngOnInit();
        const req = httpMock.expectOne(url);

        req.flush(testingData);
        expect(req.request.method).toBe('GET');
        //expect(component.data).toHaveSize(2);
        expect(component.data).toEqual(testingData);

    });

    it('Tests the variables', () => {
        expect(component.data).toHaveSize(2);
        expect(component.docId).toBe("");
        //expect(component.getDoc).toHaveSize(2);
        expect(component.getDocResult).toBe("");
        expect(component.onChangeData).toBe("");
        expect(component.test).toBe(false);
        expect(component.header).toEqual("Frontend");
    });

    it('Should restore the documents', () => {
        //component.reset();
        const req = httpMock.expectOne(`${url}/reset`);
        
        req.flush(testingData[0]);
        expect(req.request.method).toBe('GET');
        expect(component.test).toBe(true);
    });


    it('Should update an axisting document', () => {
        component.docId = testingData[0]._id;
        component.header = "Update doc";
        component.getDocResult = "<p> Uppdating doc.</p>";

        component.update();
        const req = httpMock.expectOne(`${url}/update/${component.docId}`);
        
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
    });*/
});
