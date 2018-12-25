import { NgModule } from '@angular/core';
import { LinkDirective } from './link.directive';
import { LinkHandler } from './link-handler.service';
import { PrefetchRegistry } from './prefetch-registry.service';
import { QuicklinkStrategy } from './quicklink-strategy.service';

@NgModule({
  declarations: [LinkDirective],
  providers: [LinkHandler, PrefetchRegistry, QuicklinkStrategy],
  exports: [LinkDirective]
})
export class QuicklinkModule {}
