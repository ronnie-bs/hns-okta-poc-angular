export interface OktaTokenResponse {
    accessToken: string;
    expiresIn: number;
    idToken: string;
    scopes: string[];
    tokenType: string;
/*    
    access_token: string;
    expires_in: number;
    id_token: string;
    scopes: string[];
    token_type: string;
*/
}
