import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
    selector: 'login',
    template: ''
})
export class LoginComponent implements OnInit {
    constructor (
        private loginSvc: LoginService
    ) {}

    async ngOnInit() {
        const authUrl = await this.loginSvc.getAuthUrl();
        console.log("AuthUrl", authUrl);
        window.location.href = authUrl;
    }
}

