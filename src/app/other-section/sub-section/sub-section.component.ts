import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sub-section',
  styleUrls: ['./sub-section.component.css'],
  imports: [RouterModule],
  template: `
    <section class="sub-section">
      <h2>Sub section container</h2>
      <router-outlet></router-outlet>
      <div class="sub-section-side">
        <router-outlet name="sub-section-side"></router-outlet>
      </div>
    </section>
  `,
})
export class SubSectionComponent {}
