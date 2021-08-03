import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { NebularComponentModule } from '../shared/nebular-component.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NebularComponentModule
  ]
})
export class HomeModule { }
