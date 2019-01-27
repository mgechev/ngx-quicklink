import { NgModule } from '@angular/core';
import { LinkDirective } from './link.directive';
import { ObservableLinkHandler, PreloadLinkHandler, LinkHandler } from './link-handler.service';
import { PrefetchRegistry } from './prefetch-registry.service';
import { QuicklinkStrategy } from './quicklink-strategy.service';

@NgModule({
  declarations: [LinkDirective],
  providers: [
    {
      provide: LinkHandler,
      useClass: ObservableLinkHandler,
      multi: true
    },
    {
      provide: LinkHandler,
      useClass: PreloadLinkHandler,
      multi: true
    },
    PrefetchRegistry,
    QuicklinkStrategy
  ],
  exports: [LinkDirective]
})
export class QuicklinkModule {}
