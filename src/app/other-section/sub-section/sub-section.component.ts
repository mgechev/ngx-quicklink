import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sub-section',
  standalone: true,
  imports: [RouterModule],
  template: `
    <section>
      <h2>Sub section container</h2>
      <router-outlet></router-outlet>
    </section>
  `,
})
export class SubSectionComponent {}
