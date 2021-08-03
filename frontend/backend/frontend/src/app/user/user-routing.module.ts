import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../shared/ isAdmin.guard';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'user',
    component: UsersComponent,
    data: { title: 'List of users' },
    canActivate: [IsAdminGuard]
  },
  {
    path: 'user/detail/:id',
    component: UserComponent,
    data: { title: 'user' },
    canActivate: [IsAdminGuard]
  },
  {
    path: 'user/create',
    component: UserEditComponent,
    data: { title: 'Add user' },
    canActivate: [IsAdminGuard]
  },
  {
    path: 'user/edit/:id',
    component: UserEditComponent,
    data: { title: 'Edit user' },
    canActivate: [IsAdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
