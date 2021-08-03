import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NebularComponentModule } from '../shared/nebular-component.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductComponent,
    ProductEditComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NebularComponentModule,
    SpinnerModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule,
  ]
})
export class ProductModule { }
