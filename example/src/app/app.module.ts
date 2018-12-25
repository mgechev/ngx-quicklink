import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    QuicklinkModule,
    RouterModule.forRoot(routes, {preloadingStrategy: QuicklinkStrategy}),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
