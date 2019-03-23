import { Injectable, InjectionToken } from '@angular/core';
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

declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}

const requestIdleCallback =
  typeof window !== 'undefined'
    ? window.requestIdleCallback ||
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

const cancelIdleCallback =
  typeof window !== 'undefined' ? window.cancelIdleCallback || clearTimeout : () => {};
const observerSupported = () =>
  typeof window !== 'undefined' ? !!(window as any).IntersectionObserver : false;

export const LinkHandler = new InjectionToken('LinkHandler');

@Injectable()
export class ObservableLinkHandler implements LinkHandlerStrategy {
  private registerIdle: any;
  private unregisterIdle: any;
  private registerBuffer: Element[] = [];
  private unregisterBuffer: Element[] = [];
  private elementLink = new Map<Element, LinkDirective>();
  private observer: IntersectionObserver | null = observerSupported()
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            this.queue.add(this.elementLink.get(link).urlTree);
            this.observer.unobserve(link);
            requestIdleCallback(() => {
              this.loader.preload().subscribe(() => void 0);
            });
          }
        });
      })
    : null;

  constructor(private loader: RouterPreloader, private queue: PrefetchRegistry) {}

  register(el: LinkDirective) {
    this.elementLink.set(el.element, el);
    cancelIdleCallback(this.registerIdle);
    this.registerBuffer.push(el.element);
    this.registerIdle = requestIdleCallback(() => {
      this.registerBuffer.forEach(e => this.observer.observe(e));
      this.registerBuffer = [];
    });
  }

  unregister(el: LinkDirective) {
    this.elementLink.delete(el.element);
    cancelIdleCallback(this.unregisterIdle);
    this.unregisterBuffer.push(el.element);
    this.unregisterIdle = requestIdleCallback(() => {
      this.unregisterBuffer.forEach(e => this.observer.unobserve(e));
      this.unregisterBuffer = [];
    });
  }

  supported() {
    return observerSupported();
  }
}

@Injectable()
export class PreloadLinkHandler implements LinkHandlerStrategy {
  constructor(private loader: RouterPreloader, private queue: PrefetchRegistry) {}

  register(el: LinkDirective) {
    this.queue.add(el.urlTree);
    requestIdleCallback(() => this.loader.preload().subscribe(() => void 0));
  }

  unregister(_: LinkDirective) {}

  supported() {
    return true;
  }
}
