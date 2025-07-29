import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterModule],
    template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
