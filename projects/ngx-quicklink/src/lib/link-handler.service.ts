import { Injectable, InjectionToken, NgZone } from '@angular/core';
import { LinkDirective } from './link.directive';
import { RouterPreloader } from '@angular/router';
import { LinkHandlerStrategy } from './link-handler-strategy';
import { PrefetchRegistry } from './prefetch-registry.service';

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

type RequestIdleCallback = ((
  callback: ((deadline: RequestIdleCallbackDeadline) => void),
  opts?: RequestIdleCallbackOptions
) => RequestIdleCallbackHandle);

const requestIdleCallback: RequestIdleCallback =
  typeof window !== 'undefined'
    ? (window as any).requestIdleCallback ||
      function(cb: Function) {
        const start = Date.now();
        return setTimeout(function() {
          cb({
            didTimeout: false,
            timeRemaining: function() {
              return Math.max(0, 50 - (Date.now() - start));
            }
          });
        }, 1);
      }
    : () => {};

const observerSupported = () =>
  typeof window !== 'undefined' ? !!(window as any).IntersectionObserver : false;

export const LinkHandler = new InjectionToken('LinkHandler');

@Injectable({ providedIn: 'root' })
export class ObservableLinkHandler implements LinkHandlerStrategy {
  private elementLink = new Map<Element, LinkDirective>();
  private observer: IntersectionObserver | null = observerSupported()
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!this.observer) {
            return;
          }
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;

            const routerLink = this.elementLink.get(link);
            if ( !routerLink || !routerLink.urlTree ) return;

            this.registry.add(routerLink.urlTree);
            this.observer.unobserve(link);
            requestIdleCallback(() => {
              this.loader.preload().subscribe(() => void 0);
            });
          }
        });
      })
    : null;

  constructor(
    private loader: RouterPreloader,
    private registry: PrefetchRegistry,
    private ngZone: NgZone,
  ) {}

  register(el: LinkDirective) {
    this.elementLink.set(el.element, el);
    this.ngZone.runOutsideAngular(() => {
      if (!this.observer) {
        return;
      }
      this.observer.observe(el.element);
    });
  }

  // First call to unregister will not hit this.
  unregister(el: LinkDirective) {
    if (!this.observer) {
      return;
    }
    if (this.elementLink.has(el.element)) {
      this.observer.unobserve(el.element);
      this.elementLink.delete(el.element);
    }
  }

  supported() {
    return observerSupported();
  }

}

@Injectable({ providedIn: 'root' })
export class PreloadLinkHandler implements LinkHandlerStrategy {
  constructor(
    private loader: RouterPreloader,
    private registry: PrefetchRegistry,
  ) {}

  register(el: LinkDirective) {
    this.registry.add(el.urlTree);
    requestIdleCallback(() => this.loader.preload().subscribe(() => void 0));
  }

  unregister(_: LinkDirective) {}

  supported() {
    return true;
  }
}
