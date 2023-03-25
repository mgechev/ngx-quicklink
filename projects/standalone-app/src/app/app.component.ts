import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkDirective } from 'ngx-quicklink';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./app.component.less'],
  imports: [RouterModule, QuicklinkDirective],
  template: `
    <h1>Standalone Example</h1>

    <div class="navigation">
      <a routerLink="['/']">Root</a>
      <a [routerLink]="primaryRoutePath">Home</a>
      <a [routerLink]="['/', 'about']">About</a>
      <a [routerLink]="secondaryRoutePath">Social</a>
    </div>

    <router-outlet></router-outlet>

    <div class="side">
      Side Outlet
      <router-outlet name="side"></router-outlet>
    </div>
  `,
})
export class AppComponent {
  primaryRoutePath: any[] = [];
  secondaryRoutePath: any[] = [];

  constructor() {
    // The timeouts are used to demonstrate dynamically preloading routes
    // Check the network tab to see this in action!
    setTimeout(() => {
      this.primaryRoutePath = ['/', 'home'];
      console.log('Home route added');
    }, 3000);
    setTimeout(() => {
      this.secondaryRoutePath = ['/', { outlets: { side: ['social'] } }];
      console.log('Social route added');
    }, 2000);
  }
}
