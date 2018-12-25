import { Directive, ElementRef, Optional } from '@angular/core';
import { RouterLink, RouterLinkWithHref, Router } from '@angular/router';
import { LinkHandler } from './link-handler.service';

@Directive({
  selector: '[routerLink]'
})
export class LinkDirective {
  private routerLink: RouterLink | RouterLinkWithHref;

  constructor(
    private linkHandler: LinkHandler,
    private el: ElementRef,
    @Optional() link: RouterLink,
    @Optional() linkWithHref: RouterLinkWithHref
  ) {
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
