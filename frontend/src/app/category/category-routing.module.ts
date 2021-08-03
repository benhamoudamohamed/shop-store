import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  {
    path: 'category',
    component: CategoriesComponent,
    data: { title: 'List of categories' },
  },
  {
    path: 'category/detail/:id',
    component: CategoryComponent,
    data: { title: 'category' }
  },
  {
    path: 'category/create',
    component: CategoryEditComponent,
    data: { title: 'Add category' }
  },
  {
    path: 'category/edit/:id',
    component: CategoryEditComponent,
    data: { title: 'Edit category' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
