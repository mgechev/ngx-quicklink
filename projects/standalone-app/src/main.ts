import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {
        path: 'about',
        loadComponent: () => import('./app/about.component').then(c => c.default)
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./app/home.component').then(c => c.default)
      }
    ])
  ]
});
