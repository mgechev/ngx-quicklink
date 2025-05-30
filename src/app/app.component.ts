import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'csr';
  visible = true;
  primaryRoutePath = '';
  secondaryRoutePath: any[] = [];
  constructor() {
    setTimeout(() => this.primaryRoutePath = 'home', 1000);
    setTimeout(() => this.secondaryRoutePath = ['', { outlets: { side: ['social'] } }], 2000);
  }
}
