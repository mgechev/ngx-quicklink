import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialRoutingModule } from './social-routing.module';
import { SocialComponent } from './social.component';


@NgModule({
  declarations: [SocialComponent],
  imports: [
    CommonModule,
    SocialRoutingModule
  ]
})
export class SocialModule { }
