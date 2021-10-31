import { Injectable } from "@angular/core";
import { CommonConstants } from "src/app/common/constants/common-constants";
import { encode as base64encode } from "base64-arraybuffer";
import NonceGenerator from "a-nonce-generator";

const CLIENT_ID = "0oa2gfmv78peGnHEy5d7";
const CALLBACK_URI = 'login/callback';
const SCOPES = ["openid", "profile", "email"];

@Injectable()
export class LoginService {
    private codeVerifier: string = "";
    private codeChallenge: string = "";
    private state: string = "";

    async getAuthUrl(): Promise<string> {
        return `${CommonConstants.OKTA_AUTH_BASE_URL}` +
            `?${this.getClientIdUrlParam()}` +
            `&${await this.getCodeChallengeUrlParam()}` +
            `&${this.getCodeChallengeMethodUrlParam()}` +
            `&${this.getNonceUrlParam()}` +
            `&${this.getRedirectUrlParam()}` +
            `&${this.getResponseTypeUrlParam()}` +
            `&${this.getStateUrlParam()}` +
            `&${this.getScopeUrlParam()}`;
    }

    private getClientIdUrlParam(): string {
        return `client_id=${CLIENT_ID}`;
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

    private getRedirectUrlParam(): string {
        return `redirect_uri=${this.getRedirectUri()}`;
    }

    private getResponseTypeUrlParam(): string {
        return `response_type=code`;
    }

    private getStateUrlParam(): string {
        return `state=${this.getState()}`;
    }

    private getScopeUrlParam(): string {
        const scopeString = `scope=${SCOPES.join(" ")}`;
        return encodeURI(scopeString);
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
