import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private token = new BehaviorSubject("Token");
    currentToken = this.token.asObservable();

    private user = new BehaviorSubject("User Id");
    currentUser = this.user.asObservable();


    private userName = new BehaviorSubject("User Name");
    currentUserName = this.userName.asObservable();

    private userEmail = new BehaviorSubject("User Email");
    currentUserEmail = this.userEmail.asObservable();

    private docID = new BehaviorSubject("Document id");
    currentDocID = this.docID.asObservable();

    private docName = new BehaviorSubject("Document name");
    currentDocName = this.docName.asObservable();

    constructor() { }

    changeToken(data: string) {
        this.token.next(data);
    }

    getToken() {
        return this.token.getValue();
    }

    changeUser(data: string) {
        this.user.next(data);
    }

    changeUserName(data: string) {
        this.userName.next(data);
    }

    changeUserEmail(data: string) {
        this.userEmail.next(data);
    }

    changeDocName(data: string) {
        this.docName.next(data);
    }

    changeDocId(data: string) {
        this.docID.next(data);
    }
}
