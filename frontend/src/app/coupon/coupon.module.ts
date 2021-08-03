import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponRoutingModule } from './coupon-routing.module';
import { CouponsComponent } from './coupons/coupons.component';
import { CouponComponent } from './coupon/coupon.component';
import { CouponEditComponent } from './coupon-edit/coupon-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NebularComponentModule } from '../shared/nebular-component.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    CouponsComponent,
    CouponComponent,
    CouponEditComponent
  ],
  imports: [
    CommonModule,
    CouponRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NebularComponentModule,
    SpinnerModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    QRCodeModule,
  ]
})
export class CouponModule { }
