import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { CommonConstants } from "src/app/common/constants/common-constants";
import { SessionUtils } from "src/app/common/utils/session-utils";

const USERS_API_URI = 'users';

@Injectable()
export class ProfileService {
    constructor(
        private http: HttpClient
    ) {}

    public getUsers(includejwt: boolean): Observable<any> {
        const usersApiUrl = this.getUsersApiUrl();
        const sessionInfo = SessionUtils.getSessionInfo();
        let retVal: Observable<any> = of(null);
        if (includejwt) {
            retVal = this.http.get(usersApiUrl, { headers: { 'authorization': `bearer ${sessionInfo.accessToken}` } });
        } else {
            retVal = this.http.get(usersApiUrl);
        }
        return retVal;
    }

    protected getUsersApiUrl() {
        return `${CommonConstants.HNS_API_BASE_URL}/${USERS_API_URI}`;
    }
}