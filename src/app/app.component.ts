import { Component, OnInit } from '@angular/core';
import { CommonConstants } from 'src/app/common/constants/common-constants';
import { SessionUtils } from 'src/app/common/utils/session-utils';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    user: string | null = null;

    ngOnInit() {
        const sessionInfo = SessionUtils.getSessionInfo();
        if (sessionInfo) {
            this.user = sessionInfo.user;
        } else {
            // window.location.href = CommonConstants.OKTA_LOGIN_URL;
        }
    }
}
