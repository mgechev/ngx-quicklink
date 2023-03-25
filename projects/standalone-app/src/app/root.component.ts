import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuicklinkDirective } from 'ngx-quicklink';

@Component({
  standalone: true,
  imports: [RouterLink, QuicklinkDirective],
  template: ` Root Component `,
})
export default class RootComponent {}
