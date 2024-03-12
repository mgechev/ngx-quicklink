import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'social',
    loadChildren: () =>
      import('./social/social.module').then((m) => m.SocialModule),
    outlet: 'side',
  },
  {
    path: 'other-section',
    loadComponent: () =>
      import('./other-section/other-section.component').then(
        (c) => c.OtherSectionComponent
      ),
    children: [
      {
        path: 'common-info',
        loadComponent: () =>
          import('./other-section/common-info/common-info.component').then(
            (c) => c.CommonInfoComponent
          ),
      },
      {
        path: ':subSectionSlug',
        loadComponent: () =>
          import('./other-section/sub-section/sub-section.component').then(
            (c) => c.SubSectionComponent
          ),
        children: [
          {
            path: 'side',
            loadComponent: () =>
              import('./other-section/sub-section/side/side.component').then(
                (c) => c.SubSectionSideComponent
              ),
            outlet: 'sub-section-side',
          },
          {
            path: ':pageSlug',
            loadComponent: () =>
              import('./other-section/sub-section/page/page.component').then(
                (c) => c.SectionPageComponent
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
