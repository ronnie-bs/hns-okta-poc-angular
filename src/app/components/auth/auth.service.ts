
import { Injectable } from "@angular/core";
import { CommonConstants } from "src/app/common/constants/common-constants";
import { encode as base64encode } from "base64-arraybuffer";
import NonceGenerator from "a-nonce-generator";
import { SessionUtils } from "src/app/common/utils/session-utils";
import { HttpClient } from "@angular/common/http";
import { OktaTokenResponse } from "src/app/common/models/okta-token-response.model";

const CLIENT_ID = "0oa2gfmv78peGnHEy5d7";
const CALLBACK_URI = 'login/callback';
const SCOPES = ["openid", "profile", "email"];
@Injectable()
export class AuthService {
    private codeVerifier: string = "";
    private codeChallenge: string = "";
    private state: string = "";
    private oktaTokenResponse: OktaTokenResponse | null = null;

    constructor(
        private http: HttpClient
    ) {
        const ssoVerifyInfo = SessionUtils.getSsoVerifyInfo();
        if (ssoVerifyInfo) {
            this.codeVerifier = ssoVerifyInfo.codeVerifier;
            this.codeChallenge = ssoVerifyInfo.codeChallenge;
            this.state = ssoVerifyInfo.state;
            // SessionUtils.removeSsoVerifyInfo();
        }
    }

    public isAuthenticated(): boolean {
        const sessionInfo = SessionUtils.getSessionInfo();
        return (sessionInfo && sessionInfo.user !== null);
    }

    public isStatesMatch(state: string): boolean {
        return this.state === state;
    }

    public async redirectToAuthUrl() {
        const authUrl = await this.getAuthUrl();
        console.log("AuthUrl", authUrl);
        SessionUtils.saveSsoVerifyInfo({
            codeVerifier: this.codeVerifier,
            codeChallenge: this.codeChallenge,
            state: this.state
        });
        window.location.href = authUrl;
    }

    public exchangeCodeForToken(authCode: string) {
        const tokenUrl = this.getTokenUrl();
        console.log("TokenUrl", tokenUrl);
        const tokenRequestBody = this.getTokenRequestBody(authCode);
        console.log("TokenRequestBody", tokenRequestBody);

        this.http.post(tokenUrl, tokenRequestBody, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } )
            .subscribe(tokenResponse => {
                console.log("Token Response", tokenResponse);
                this.oktaTokenResponse = this.parseTokenResponse(tokenResponse);
            });
    }

    public getTokenUrl(): string {
        return `${CommonConstants.OKTA_TOKEN_BASE_URL}`;
    }

    public getTokenRequestBody(authCode: string): string {
        return `${this.getClientIdUrlParam()}` +
            `&${this.getCodeVerifierUrlParam()}` +
            `&${this.getRedirectUriUrlParam()}` +
            `&${this.getGrandTypeUrlParam()}` +
            `&${this.getAuthCodeUrlParam(authCode)}`;
    }

    public async getAuthUrl(): Promise<string> {
        return `${CommonConstants.OKTA_AUTH_BASE_URL}` +
            `?${this.getClientIdUrlParam()}` +
            `&${this.getRedirectUriUrlParam()}` +
            `&${this.getResponseTypeUrlParam()}` +
            `&${this.getResponseModeUrlParam()}` +
            `&${this.getStateUrlParam()}` +
            `&${this.getNonceUrlParam()}` +
            `&${await this.getCodeChallengeUrlParam()}` +
            `&${this.getCodeChallengeMethodUrlParam()}` +
            `&${this.getScopeUrlParam()}`;
    }

    private getClientIdUrlParam(): string {
        return `client_id=${CLIENT_ID}`;
    }

    private getCodeVerifierUrlParam(): string {
        return `code_verifier=${this.getCodeVerifier()}`;
    }

    private async getCodeChallengeUrlParam(): Promise<string> {
        return `code_challenge=${await this.getCodeChallenge()}`;
    }

    private getCodeChallengeMethodUrlParam(): string {
        return `code_challenge_method=S256`;
    }

    private getNonceUrlParam(): string {
        return `nonce=${this.getNonce()}`
    }

    private getRedirectUriUrlParam(): string {
        return `redirect_uri=${this.getRedirectUri()}`;
    }

    private getResponseTypeUrlParam(): string {
        return `response_type=code`;
    }

    private getResponseModeUrlParam(): string {
        return `response_mode=fragment`;
    }

    private getStateUrlParam(): string {
        return `state=${this.getState()}`;
    }

    private getScopeUrlParam(): string {
        const scopeString = `scope=${SCOPES.join(" ")}`;
        return encodeURI(scopeString);
    }

    private getGrandTypeUrlParam(): string {
        return `grant_type=authorization_code`;
    }

    private getAuthCodeUrlParam(authCode: string) {
        return `code=${authCode}`;
    }

    private getCodeVerifier(): string {
        if (this.codeVerifier === "") {
            this.codeVerifier = this.getRandomString();
        }
        return this.codeVerifier;
    }

    private async getCodeChallenge(): Promise<string> {
        if (this.codeChallenge === "") {
            const encoder = new TextEncoder();
            const data = encoder.encode(this.getCodeVerifier());
            const digest = await window.crypto.subtle.digest("SHA-256", data);
            const base64Digest = base64encode(digest);
            this.codeChallenge = base64Digest
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, "");
        }
        return this.codeChallenge;
    }

    private getNonce() {
        const ng = new NonceGenerator();
        return ng.generate();
    }

    private getRedirectUri() {
        const baseUri = `${window.location.origin}/${CALLBACK_URI}`;
        return encodeURI(baseUri);
    }

    private getState() {
        if (this.state === "") {
            this.state = this.getRandomString();
        }
        return this.state;
    }

    private parseTokenResponse(tokenResponse: any): OktaTokenResponse {
        return {
            accessToken: tokenResponse["access_token"],
            expiresIn: tokenResponse["expires_in"],
            idToken: tokenResponse["id_token"],
            scopes: tokenResponse["scopes"].split(" "),
            tokenType: tokenResponse["token_type"]
        };
    }

    private getRandomString() {
        let retVal = "";
        const charDomain = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";       
        for (let i = 0; i < 64; i++) {
            retVal += charDomain.charAt(Math.floor(Math.random() * charDomain.length));
        }
        return retVal;
    }
}


/*
    https://dev-92274704.okta.com/oauth2/default/v1/authorize
        ?client_id=0oa2gfmv78peGnHEy5d7
        &code_challenge=6YpQDVD1nVjGkT07QJv2YYWZqUjMGDifyRdUcIo6DBM
        &code_challenge_method=S256
        &nonce=8HhsyZz23S0oEk3ukxJhww5aviftt6jfOJhCs30kj4SpWOUtjQbeukvwI9hgedVG
        &redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2Fcallback
        &response_type=code
        &state=E8sqiucDoso24oV1G34E3LQ96Nxg5olPjv4Dqgy26GTyx5Gc8ieZUp8akAGWtcw2
        &scope=openid%20profile%20email
*/
