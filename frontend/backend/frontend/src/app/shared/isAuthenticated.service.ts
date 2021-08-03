import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as Cookies from 'js-cookie'
import * as cryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable()
export class IsAuthenticated {

  private lang: string = environment.lang;

  constructor(public jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    const userToken = Cookies.get('lang_defautl_sys') || Cookies.get('lang_defautl_2');
    if(!userToken) {
      return;
    } else {
      const bytes  = cryptoJS.AES.decrypt(userToken, this.lang);
      const decrypt = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
      return !this.jwtHelper.isTokenExpired(decrypt);
    }
  }
}
