import { NgModule } from '@angular/core';
import {
  ObservableLinkHandler,
  PreloadLinkHandler,
  LinkHandler,
} from './link-handler.service';
import { LinkDirective } from './link.directive';
import { PrefetchRegistry } from './prefetch-registry.service';
import { QuicklinkStrategy } from './quicklink-strategy.service';

export const quicklinkProviders = [
  {
    provide: LinkHandler,
    useClass: ObservableLinkHandler,
    multi: true,
  },
  {
    provide: LinkHandler,
    useClass: PreloadLinkHandler,
    multi: true,
  },
  PrefetchRegistry,
  QuicklinkStrategy,
];

@NgModule({
  imports: [LinkDirective],
  exports: [LinkDirective],
  providers: quicklinkProviders,
})
export class QuicklinkModule {}
