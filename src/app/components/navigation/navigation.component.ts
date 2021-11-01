import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
    subs$: Subscription[] = [];
    activeSelection = "home";

    constructor(
        private router: Router,
        private authSvc: AuthService
    ) {}

    ngOnInit() {
        const sub$ = this.router.events
            .pipe(filter(event => event instanceof NavigationStart))
            .subscribe((e) => {
                const event = <NavigationStart> e;
                this.activeSelection = this.activeSelection === "" ? event.url.replace("/", "") : this.activeSelection;
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

    navigateTo(uri: string) {
        switch(uri) {
            case "logout":
                this.activeSelection = "logout";
                this.authSvc.logout();
                break;
            case "tazio":
                this.activeSelection = "tazio";
                break;
            case "eightfold":
                this.activeSelection = "eightfold";
                break;
            default:
                this.activeSelection = "";
                this.router.navigate([uri]);
        }
    }
}
