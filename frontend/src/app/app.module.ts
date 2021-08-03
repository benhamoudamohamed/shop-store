import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbSidebarService } from '@nebular/theme';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IsLogInGuard } from './shared/ isLogin.guard';
import { LogModule } from './user/log/log.module';
import { IsAuthenticated } from './shared/isAuthenticated.service';
import { StoreModule } from './store/store.module';
import * as Cookies from 'js-cookie'
import * as cryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
const lang: string = environment.lang;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          const userToken = Cookies.get('lang_defautl_sys') || Cookies.get('lang_defautl_2');
          const bytes  = cryptoJS.AES.decrypt(userToken, lang);
          const decrypt = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
          return decrypt
        },
        throwNoTokenError: true,
        skipWhenExpired: true,
        allowedDomains: environment.whitelist,
        disallowedRoutes: [""],
      },
    }),
    LogModule,
    StoreModule,
  ],
  providers: [NbSidebarService, IsLogInGuard, IsAuthenticated, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
