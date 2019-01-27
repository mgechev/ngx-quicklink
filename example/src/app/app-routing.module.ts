import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadChildren: './about/about.module#AboutModule'
  },
  {
    path: 'contact',
    loadChildren: './contact/contact.module#ContactModule',
    data: {
      preload: true
    }
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
