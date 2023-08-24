import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import { HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js'; 

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const CODE_VERIFIER = 'code_verifier';
const USER = 'user';
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token_url = environment.token_url;

  authorize_uri = environment.authorize_uri;
  logout_url = environment.logout_url;
  private _usuario: Usuario | null;
  private _accessToken: string | null;
  private _refreshToken: string | null;

  params: any = {
    client_id: environment.client_id,
    redirect_uri: environment.redirect_uri,
    scope: environment.scope,
    response_type: environment.response_type,
    response_mode: environment.response_mode,
    code_challenge_method: environment.code_challenge_method
  }

  constructor(private http: HttpClient) {
    this._usuario = null;
    this._accessToken = null;
    this._refreshToken = null;
  }

  public getToken(code: string, code_verifier: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', environment.grant_type);
    body.set('client_id', environment.client_id);
    body.set('redirect_uri', environment.redirect_uri);
    body.set('scope', environment.scope);
    body.set('code_verifier', code_verifier);
    body.set('code', code);
    const basic_auth = 'Basic ' + btoa('client:secret');
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });
    const httpOptions = { headers: headers_object};
    return this.http.post<any>(this.token_url, body, httpOptions);
  }

  setTokens(access_token: string, refresh_token: string): void {
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.setItem(ACCESS_TOKEN, access_token);
    this._accessToken = access_token;
    sessionStorage.removeItem(REFRESH_TOKEN);
    sessionStorage.setItem(REFRESH_TOKEN, refresh_token);
    this._refreshToken = refresh_token;
  }

  public get accessToken(): string | null {
    if (this._accessToken != null) {
      return this._accessToken;
    } else if (this._accessToken == null && sessionStorage.getItem(ACCESS_TOKEN) != null) {
      this._accessToken = sessionStorage.getItem(ACCESS_TOKEN);
      return this._accessToken;
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (this._refreshToken != null) {
      return this._refreshToken;
    } else if (this._refreshToken == null && sessionStorage.getItem(REFRESH_TOKEN) != null) {
      this._refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
      return this._refreshToken;
    }
    return null;
  }

  setUser(accessToken: string): void {
    sessionStorage.removeItem(USER);
    const payload = this.getPayload(accessToken);
    const usuario = new Usuario();
    //usuario.nombre = payload.nombre;
    //usuario.apellido = payload.apellido;
    //usuario.email = payload.email;
    usuario.username = payload.username;
    usuario.roles = payload.roles;
    this._usuario = usuario;
    sessionStorage.setItem(USER, JSON.stringify(usuario));
  }

  public get user(): Usuario | null {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem(USER) != null) {
      const usuario = sessionStorage.getItem(USER);
      if (usuario != null) {
        this._usuario = JSON.parse(usuario) as Usuario;
        return this._usuario;
      }
    }
    return new Usuario();
  }

  isAuthenticated(): boolean {
    const payload = this.getPayload(this.accessToken);
    return (payload != null && payload.username && payload.username.length > 0);
  }

  getPayload(accessToken: string | null): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  setVerifier(code_verifier: string): void {
    if (sessionStorage.getItem(CODE_VERIFIER)) {
      this.deleteVerifier();
    }
    const encrypted = CryptoJS.AES.encrypt(code_verifier, environment.secret_pkce);
    sessionStorage.setItem(CODE_VERIFIER, encrypted.toString());
  }

  getVerifier(): string | null {
    const encrypted = sessionStorage.getItem(CODE_VERIFIER);
    const decrypted = encrypted === null ? null : CryptoJS.AES.decrypt(encrypted, environment.secret_pkce).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
  
  deleteVerifier(): void {
    sessionStorage.removeItem(CODE_VERIFIER);
  }

  hasRole(role: string): boolean {
    const payload = this.getPayload(this._accessToken);
    return (payload?.roles.includes(role));
  }

  getCodeUrl(): string {
    const code_verifier = this.generateCodeVerifier();
    this.setVerifier(code_verifier);
    this.params.code_challenge = this.generateCodeChallenge(code_verifier);
    const httpParams = new HttpParams({fromObject: this.params});
    return this.authorize_uri + httpParams.toString();
  }

  generateCodeVerifier(): string {
    let result = '';
    const char_length = CHARACTERS.length;
    for(let i =0; i < 44; i++) {
      result += CHARACTERS.charAt(Math.floor(Math.random() * char_length));
    }
    return result;
  }

  generateCodeChallenge(code_verifier: string): string {
    const codeverifierHash = CryptoJS.SHA256(code_verifier).toString(CryptoJS.enc.Base64);
    const code_challenge = codeverifierHash
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    return code_challenge;
  }

  logout(): void {
    this._accessToken = null;
    this._refreshToken = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(REFRESH_TOKEN);
    sessionStorage.removeItem(USER);
  }

  isTokenExpired(): boolean {
    const payload = this.getPayload(this.accessToken);
    const now = new Date().getTime() / 1000;
    console.log('payload.exp', payload.exp);
    return (payload.exp < now);
  }
}
