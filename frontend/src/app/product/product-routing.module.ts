import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: 'product',
    component: ProductsComponent,
    data: { title: 'List of products' },
  },
  {
    path: 'product/detail/:id',
    component: ProductComponent,
    data: { title: 'product' }
  },
  {
    path: 'product/create',
    component: ProductEditComponent,
    data: { title: 'Add product' }
  },
  {
    path: 'product/edit/:id',
    component: ProductEditComponent,
    data: { title: 'Edit product' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
