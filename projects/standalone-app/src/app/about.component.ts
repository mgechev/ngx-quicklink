import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkDirective } from 'ngx-quicklink';

@Component({
  standalone: true,
  imports: [RouterModule, QuicklinkDirective],
  template: `
    About component

    <a [routerLink]="['/', 'about', 'sub']">SUB</a>

    <router-outlet></router-outlet>
  `,
})
export default class AboutComponent {}
