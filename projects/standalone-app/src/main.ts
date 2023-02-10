import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { quicklinkProviders } from 'projects/ngx-quicklink/src/lib/quicklink.module';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    quicklinkProviders,
    provideRouter(
      [
        {
          path: 'about',
          loadComponent: () => import('./app/about.component'),
        },
        {
          path: '',
          pathMatch: 'full',
          loadComponent: () => import('./app/home.component'),
        },
      ],
      withPreloading(QuicklinkStrategy)
    ),
  ],
});
