import { TestBed } from '@angular/core/testing';

// testing http, router
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

// component
import { LoginComponent } from './login.component';

//service
import { TokenService } from 'app/token.service';


describe('LoginComponent', () => {
    let component: LoginComponent;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            imports: [ HttpClientTestingModule, RouterTestingModule ],
            providers: [TokenService]
        })
        .compileComponents();

        component = TestBed.inject(LoginComponent);
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
