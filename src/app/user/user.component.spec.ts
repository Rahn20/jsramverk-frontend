import { ComponentFixture, TestBed } from '@angular/core/testing';


import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserComponent } from './user.component';
import { Router } from '@angular/router';

describe('UserComponent', () => {
    let component: UserComponent;
    let httpMock: HttpTestingController;
    let url: "https://jsramverk-editor-rahn20.azurewebsites.net/me-api";
    //let url: "http://localhost:1337/me-api";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ UserComponent ],
            imports: [ HttpClientTestingModule ],
            providers: [UserComponent, Router]
        })
        .compileComponents();

        component = TestBed.inject(UserComponent);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        if (component.token) {
            expect(component).toBeTruthy();
        }
    });
});
