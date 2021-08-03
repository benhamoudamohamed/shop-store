import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { IsAuthenticated } from './isAuthenticated.service';

@Injectable({
  providedIn: 'root'
})
export class IsLogInGuard implements CanActivate {

  constructor(private isAuthenticated: IsAuthenticated, private router: Router) { }

  canActivate(): boolean {
    if (!this.isAuthenticated.isAuthenticated()) {
      this.router.navigate(['login'])
      return false;
    }
    return true;
  }
}
