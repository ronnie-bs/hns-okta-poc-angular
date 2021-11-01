import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OktaTokenResponse } from 'src/app/common/models/okta-token-response.model';
import { AuthService } from './auth.service';

@Component({
    selector: 'login-callback',
    templateUrl: './login-callback.component.html',
    styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit, OnDestroy {
    public authCode: string = "";
    public state: string = "";
    public isStatesMatch: boolean = false;
    public user: string = "";

    private subs$: Subscription[] = [];

    constructor (
        private activatedRoute: ActivatedRoute,
        private authSvc: AuthService
    ) {}

    async ngOnInit() {
        const sub$ = this.activatedRoute.fragment.subscribe(fragment => {
            const urlParams = new URLSearchParams(<string> fragment);
            this.authCode = <string> urlParams.get("code");
            this.state = <string> urlParams.get("state");
            console.log("this.authCode", this.authCode);
            console.log("this.state", this.state);
            this.isStatesMatch = this.authSvc.isStatesMatch(this.state);
            if (this.isStatesMatch) {
                this.authSvc.exchangeCodeForToken(this.authCode).subscribe((oktaTokenResponse: OktaTokenResponse) => {
                    this.user = oktaTokenResponse.user || "";
                });
            }
        });
        this.subs$.push(sub$);
    }

    ngOnDestroy() {
        this.subs$.forEach(sub$ => {
            if (!sub$.closed) {
                sub$.unsubscribe();
            }
        });
    }
}

