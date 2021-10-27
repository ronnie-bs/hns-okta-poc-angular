import { Component, OnInit } from '@angular/core';
import { CommonConstants } from 'src/app/common/constants/common-constants';

@Component({
    selector: 'login',
    template: ''
})
export class LoginComponent implements OnInit {
    ngOnInit() {
        window.location.href = CommonConstants.OKTA_LOGIN_URL;
    }
}

