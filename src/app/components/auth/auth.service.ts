import { Injectable } from "@angular/core";
import { SessionUtils } from "src/app/common/utils/session-utils";

@Injectable()
export class AuthService {
    public isAuthenticated(): boolean {
        const sessionInfo = SessionUtils.getSessionInfo();
        return (sessionInfo && sessionInfo.user !== null);
    }
}
