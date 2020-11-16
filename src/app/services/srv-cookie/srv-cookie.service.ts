import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SrvCookieService {
  private _cookie: string;
    public get cookie(): string {
        return this._cookie;
    }
    public set cookie(value: string) {
        this._cookie = value;
    }

  constructor() { 

  }

  isExpired(): boolean {
      return false;
  }


}
