import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogRoutingModule } from './log-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NebularComponentModule } from 'src/app/shared/nebular-component.module';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

@NgModule({
  declarations: [
    ResetpasswordComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    LogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NebularComponentModule,
  ]
})
export class LogModule { }
