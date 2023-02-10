import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';

@Component({
  standalone: true,
  imports: [RouterModule, QuicklinkModule],
  template: `
    <br><br><br><br><br><br><br><br><br><br><br>
    <br><br><br><br><br><br><br><br><br><br><br>
    <br><br><br><br><br><br><br><br><br><br><br>
    <br><br><br><br><br><br><br><br><br><br><br>
    <a routerLink="/about">About</a>
  `,
})
export default class HomeComponent {}
