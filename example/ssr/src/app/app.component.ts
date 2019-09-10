import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'example';

  val = null;

  constructor() {
    setTimeout(() => this.val = '/about/team', 1500);
  }
}
