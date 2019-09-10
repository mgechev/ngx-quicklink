import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
    data: {
      preload: true
    }
  },
  {
    path: 'home/:id',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
