import { TestBed } from '@angular/core/testing';

// testing router, httpclient
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

// component
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ RegisterComponent ],
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: []
        })
        .compileComponents();

        component = TestBed.inject(RegisterComponent);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    beforeEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });
});
