import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
    selector: 'login',
    template: ''
})
export class LoginComponent implements OnInit {
    constructor (
        private authSvc: AuthService
    ) {}

    async ngOnInit() {
        // const authUrl = await this.authSvc.getAuthUrl();
        // console.log("AuthUrl", authUrl);
        // window.location.href = authUrl;
        await this.authSvc.redirectToAuthUrl();
    }
}

