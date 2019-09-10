import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./home/about/about.module').then(m => m.AboutModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
