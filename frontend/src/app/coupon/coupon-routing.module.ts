import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponEditComponent } from './coupon-edit/coupon-edit.component';
import { CouponComponent } from './coupon/coupon.component';
import { CouponsComponent } from './coupons/coupons.component';

const routes: Routes = [
  {
    path: 'coupon',
    component: CouponsComponent,
    data: { title: 'List of coupons' },
  },
  {
    path: 'coupon/detail/:id',
    component: CouponComponent,
    data: { title: 'coupon' }
  },
  {
    path: 'coupon/create',
    component: CouponEditComponent,
    data: { title: 'Add coupon' }
  },
  {
    path: 'coupon/edit/:id',
    component: CouponEditComponent,
    data: { title: 'Edit coupon' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
