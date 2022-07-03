import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { QuicklinkModule } from 'ngx-quicklink';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    QuicklinkModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
