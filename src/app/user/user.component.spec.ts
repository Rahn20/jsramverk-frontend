import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';

// testing router
import { RouterTestingModule } from '@angular/router/testing';

// apollo testing module
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';

// component
import { UserComponent } from './user.component';

//service
import { TokenService } from 'app/token.service';


describe('UserComponent', () => {
    let component: UserComponent;
    let apolloTestingController: ApolloTestingController;
    let service: TokenService;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ UserComponent ],
            imports: [ RouterTestingModule, ApolloTestingModule ],
            providers: [TokenService]
        })
        .compileComponents();

        component = TestBed.inject(UserComponent);
        service = TestBed.inject(TokenService);
        apolloTestingController = TestBed.inject(ApolloTestingController);
    });

    beforeEach(() => {
        // After every test, assert that there are no more pending requests.
        apolloTestingController.verify();

        // ngOnDestroy
        component.querySubscription = new Subscription();
        spyOn(component.querySubscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(component.querySubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });
});
