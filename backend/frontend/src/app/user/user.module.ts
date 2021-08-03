import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NebularComponentModule } from '../shared/nebular-component.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SpinnerModule } from '../spinner/spinner.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    UserComponent,
    UsersComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NebularComponentModule,
    SpinnerModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule,
  ]
})
export class UserModule { }
