import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchasesComponent } from './purchases/purchases.component';

const routes: Routes = [
  {
    path: 'purchase',
    component: PurchasesComponent,
    data: { title: 'List of purchases' },
  },
  {
    path: 'purchase/detail/:id',
    component: PurchaseComponent,
    data: { title: 'purchase' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
