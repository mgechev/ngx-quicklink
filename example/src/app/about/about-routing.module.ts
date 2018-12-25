import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: AboutComponent
}, {
  path: 'team',
  loadChildren: './team/team.module#TeamModule'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
