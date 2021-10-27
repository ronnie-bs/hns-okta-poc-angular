import { SessionInfo } from "../models/session-info";

export class SessionUtils {
    public static getSessionInfo(): SessionInfo {
        let retVal = null;
        try {
            const sessionInfoStr = sessionStorage.getItem("sessionInfo");
            if (sessionInfoStr) {
                retVal = JSON.parse(sessionInfoStr);
            }
        } catch (e) {
        }
        return retVal;
    }
}
