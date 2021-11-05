import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProfileService } from './profile.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
    public users$: Observable<any> = of(null);
    public includejwt = 'Y';

    constructor(
        private profileService: ProfileService
    ) {}

    ngOnInit() {
        this.users$ = of(null);
    }

    public refreshData() {
        if (this.includejwt === 'Y') {
            this.users$ = this.profileService.getUsers(true);
        } else {
            this.users$ = this.profileService.getUsers(false);
        }
    }
}
