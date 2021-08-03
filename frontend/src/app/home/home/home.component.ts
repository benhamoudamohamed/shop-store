import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NbSidebarService, NbMenuService, NbMenuItem } from '@nebular/theme';
import * as Cookies from 'js-cookie'
import * as cryptoJS from 'crypto-js';
import { IsAuthenticated } from 'src/app/shared/isAuthenticated.service';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private lang: string = environment.lang;
  private readonly destroy$ = new Subject();

  firstname: string;
  loadingSpinner = false;
  animationState = false;
  loadingAnimation = false;
  userToken: string;
  userRole: string;

  constructor(private sidebarService: NbSidebarService,
    private router: Router,
    public isAuthenticated: IsAuthenticated,
    public jwtHelper: JwtHelperService,
    private authservice: AuthService,
    private menu: NbMenuService) {
    menu.onItemClick().subscribe(res =>  this.sidebarService.toggle(true))
    menu.onItemClick().subscribe((res) => {this.router.navigateByUrl(`admin/(root:${res.item.link})`)});
  }

  ngOnInit() {
    this.authservice.whoami()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: User) => {
        this.firstname = res.firstname;
        this.userRole = res.userRole
        const encrypt = cryptoJS.AES.encrypt(JSON.stringify(this.userRole), this.lang).toString();
        Cookies.set("tr_fs_tik", encrypt, {expires: (7), secure: true})

        if(res.userRole !== 'Admin') {
          this.items.forEach(element => {
            if(element.hidden !== undefined) {
              element.hidden = true
            }
          });
        }
      })

    const interval = setInterval(() => {
      this.userToken = Cookies.get('lang_defautl_sys') || Cookies.get('lang_defautl_2');
      const bytes  = cryptoJS.AES.decrypt(this.userToken, this.lang);
      const decrypt = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
      let expiredDate = this.jwtHelper.getTokenExpirationDate(decrypt).getTime()

      const now = new Date().getTime();
      const distance = expiredDate - now;
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      // const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      // const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // console.log(days, 'days', hours, 'h', mins, 'm', seconds, 's')

      if (mins === 1) {
        this.authservice.refresh()
          .subscribe((data: any) => {
            const encrypt = cryptoJS.AES.encrypt(JSON.stringify(data.refreshToken), this.lang).toString();
            Cookies.set("lang_defautl_2", encrypt, {expires: (7), secure: true})
          })
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        Cookies.remove('lang_defautl_sys');
      }

      if (distance < 0) {
        clearInterval(interval);
        this.logout();
      }
    }, 5000)

    this.router.navigateByUrl(`admin/(root:dashboard)`)
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  logout() {
    Cookies.remove('lang_defautl_sys');
    Cookies.remove('lang_defautl_2');
    Cookies.remove('tr_fs_tik');
    this.router.navigate(['login'])
  }

  items: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/dashboard',
      home: true
    },
    {
      title: 'Users',
      icon: 'person-outline',
      hidden: false,
      expanded: false,
      children: [
        {
          title: 'Users Lists',
          link: '/user'
        },
        {
          title: 'Create',
          link: '/user/create'
        }
      ]
    },
    {
      title: 'Category',
      icon: 'list-outline',
      expanded: false,
      children: [
        {
          title: 'Categories Lists',
          link: '/category'
        },
        {
          title: 'Create',
          link: '/category/create'
        }
      ]
    },
    {
      title: 'Products',
      icon: 'list-outline',
      expanded: false,
      children: [
        {
          title: 'Products Lists',
          link: '/product'
        },
        {
          title: 'Create',
          link: '/product/create'
        }
      ]
    },
    {
      title: 'Purchases',
      icon: 'list-outline',
      expanded: false,
      children: [
        {
          title: 'Purchases Lists',
          link: '/purchase'
        },
        {
          title: 'Create',
          link: '/purchase/create'
        }
      ]
    },
    {
      title: 'Coupons',
      icon: 'list-outline',
      expanded: false,
      children: [
        {
          title: 'Coupons Lists',
          link: '/coupon'
        },
        {
          title: 'Create',
          link: '/coupon/create'
        }
      ]
    },
  ];

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
