import { Injectable } from '@angular/core';
const TOKEN_KEY = 'AuthToken';

const NAME = 'NAME';
const EMAIL = 'EMAIL';
const PROFILE_PIC = 'PROFILE_PIC';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }
  public saveToken(token: string) { window.localStorage.removeItem(TOKEN_KEY); window.localStorage.setItem(TOKEN_KEY, token); };
  public signOutAdmin():any {
    localStorage.removeItem(TOKEN_KEY);

  };
  public getToken(): any {  return localStorage.getItem(TOKEN_KEY); }

  signOut() {

    localStorage.removeItem(TOKEN_KEY);

  }
}
