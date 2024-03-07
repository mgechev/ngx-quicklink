import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';

@Component({
  selector: 'other-section',
  standalone: true,
  imports: [RouterModule, QuicklinkModule],
  styleUrls: ['./other-section.component.css'],
  template: `
    <section>
      <h1>Container</h1>
      <ul>
        <li><a routerLink="/other-section/common-info">Common info</a></li>
        <li>
          <div class="expander"><span>Expander</span></div>
        </li>
        <li><a routerLink="/other-section/1/1">Section page</a></li>
      </ul>
      <router-outlet></router-outlet>
    </section>
  `,
})
export class OtherSectionComponent {}
