import { Directive, ElementRef, Optional, Inject } from '@angular/core';
import { RouterLink, RouterLinkWithHref, Router } from '@angular/router';
import { LinkHandler } from './link-handler.service';
import { LinkHandlerStrategy } from './link-handler-strategy';

@Directive({
  selector: '[routerLink]'
})
export class LinkDirective {
  private routerLink: RouterLink | RouterLinkWithHref;
  private linkHandler: LinkHandlerStrategy;

  constructor(
    @Inject(LinkHandler) private linkHandlers: LinkHandlerStrategy[],
    private el: ElementRef,
    @Optional() link: RouterLink,
    @Optional() linkWithHref: RouterLinkWithHref
  ) {
    this.linkHandler = this.linkHandlers.filter(h => h.supported()).shift();
    this.routerLink = link || linkWithHref;
  }

  ngOnInit() {
    this.linkHandler.register(this);
  }

  ngOnDestroy() {
    this.linkHandler.unregister(this);
  }

  get element(): Element {
    return this.el.nativeElement;
  }

  get urlTree() {
    return this.routerLink.urlTree;
  }
}
