import {
  Directive,
  ElementRef,
  Optional,
  Inject,
  OnChanges,
  OnDestroy,
  Input,
  SimpleChanges
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkHandler } from './link-handler.service';
import { LinkHandlerStrategy } from './link-handler-strategy';

@Directive({
  selector: '[routerLink]',
  standalone: true
})
export class LinkDirective implements OnChanges, OnDestroy {
  @Input() routerLink: Pick<RouterLink, 'routerLink'>['routerLink'];
  private rl: RouterLink;
  private linkHandler: LinkHandlerStrategy | undefined;

  constructor(
    @Inject(LinkHandler) private linkHandlers: LinkHandlerStrategy[],
    private el: ElementRef,
    @Optional() link: RouterLink,
    @Optional() linkWithHref: RouterLink
  ) {
    this.linkHandler = this.linkHandlers.filter(h => h.supported()).shift();
    this.rl = link || linkWithHref;
    if (this.element && this.element.setAttribute) {
      this.element.setAttribute('ngx-ql', '');
    }
  }

  ngOnChanges(c: SimpleChanges) {
    if (c['routerLink'] && this.linkHandler) {
      this.linkHandler.unregister(this);
      this.linkHandler.register(this);
    }
  }

  ngOnDestroy() {
    if (!this.linkHandler) {
      return;
    }
    this.linkHandler.unregister(this);
  }

  get element(): Element {
    return this.el.nativeElement;
  }

  get urlTree(): any {
    return this.rl.urlTree;
  }
}
