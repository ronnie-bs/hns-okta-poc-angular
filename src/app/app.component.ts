import { Component, OnInit } from '@angular/core';
import { SessionUtils } from 'src/app/common/utils/session-utils';
import { AuthService } from './components/auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    user: string | null = null;
    
    public isAuthenticated = false;

    constructor(
        private auth: AuthService
    ) {}

    ngOnInit() {
        this.isAuthenticated = this.auth.isAuthenticated();
        const sessionInfo = SessionUtils.getSessionInfo();
        if (sessionInfo) {
            this.user = sessionInfo.user;
        }
    }
}
