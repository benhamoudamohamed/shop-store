import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { IsLogInGuard } from './shared/ isLogin.guard';
import { AboutComponent } from './store/about/about.component';
import { CartComponent } from './store/cart/cart.component';
import { CollectionComponent } from './store/collection/collection.component';
import { ContactComponent } from './store/contact/contact.component';
import { LandingpageComponent } from './store/landingpage/landingpage.component';
import { ProductsComponent } from './store/products/products.component';
import { ShopComponent } from './store/shop/shop.component';
import { StorehomeComponent } from './store/storehome/storehome.component';
import { LoginComponent } from './user/log/login/login.component';
import { ResetpasswordComponent } from './user/log/resetpassword/resetpassword.component';

const routes: Routes = [
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  {
    path: 'store',
    component: StorehomeComponent,
    children: [
      {path: '', component: LandingpageComponent},
      {path: 'shop', component: ShopComponent},
      {path: 'collection', component: CollectionComponent},
      {path: 'products/:id', component: ProductsComponent},
      {path: 'about', component: AboutComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'cart', component: CartComponent},
    ],
  },
  {
    path: 'admin',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        outlet: 'root',
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        outlet: 'root',
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
        outlet: 'root',
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
        outlet: 'root',
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule),
        outlet: 'root',
        canActivate: [IsLogInGuard]
      },
      {
        path: '',
        loadChildren: () => import('./coupon/coupon.module').then(m => m.CouponModule),
        outlet: 'root',
        canActivate: [IsLogInGuard]
      },
    ],
  },
  { path: 'login', component: LoginComponent},
  { path: 'user/reset', component: ResetpasswordComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
