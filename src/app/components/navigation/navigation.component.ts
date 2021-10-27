import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
    subs$: Subscription[] = [];
    activeSelection = "home";

    constructor(
        private router: Router
    ) {}

    ngOnInit() {
        const sub$ = this.router.events
            .pipe(filter(event => event instanceof NavigationStart))
            .subscribe((e) => {
                const event = <NavigationStart> e;
                this.activeSelection = event.url.replace("/", "");
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
        this.router.navigate([uri]);
    }
}
