import { Injectable, InjectionToken, NgZone } from '@angular/core';
import { LinkDirective } from './link.directive';
import { RouterPreloader, UrlTree } from '@angular/router';
import { LinkHandlerStrategy } from './link-handler-strategy';
import { PrefetchRegistry } from './prefetch-registry.service';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { catchError, concatMap, finalize, last, takeWhile, tap } from 'rxjs/operators';
import { containsTree } from './prefetch-registry.service';

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

@Injectable()
export class ObservableLinkHandler implements LinkHandlerStrategy {
  private elementLink = new Map<Element, LinkDirective>();
  private linksStream$ = new Subject<LinkDirective>();
  private loadingQueuesMap = new Map<UrlTree, BehaviorSubject<any>>();
  private observer: IntersectionObserver | null = observerSupported()
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;

            const routerLink = this.elementLink.get(link);
            if ( !routerLink || !routerLink.urlTree ) return;

            this.queue.add(routerLink.urlTree);
            this.observer.unobserve(link);
            requestIdleCallback(() => this.linksStream$.next(routerLink));
          }
        });
      })
    : null;

  constructor(
    private loader: RouterPreloader,
    private queue: PrefetchRegistry,
    private ngZone: NgZone,
  ) {
    this.linksStream$.pipe(
      tap(routerLink => {
        const urlTree = routerLink.urlTree;
        const loadingTrees = Array.from(this.loadingQueuesMap.keys());
        const parentTree = loadingTrees.find(t => containsTree(t, urlTree));
        if (parentTree) {
          this.loadingQueuesMap.get(parentTree).next(null);
        } else {
          this.createLoadingQueue(urlTree);
        }
      })
    ).subscribe();
  }

  register(el: LinkDirective) {
    this.elementLink.set(el.element, el);
    this.ngZone.runOutsideAngular(() => {
      this.observer.observe(el.element);
    });
  }

  // First call to unregister will not hit this.
  unregister(el: LinkDirective) {
    if (this.elementLink.has(el.element)) {
      this.observer.unobserve(el.element);
      this.elementLink.delete(el.element);
    }
  }

  supported() {
    return observerSupported();
  }

  private createLoadingQueue(urlTree: UrlTree) {
    const stream$ = new BehaviorSubject(null);
    this.loadingQueuesMap.set(urlTree, stream$);
    let counter = 0;
    stream$.pipe(
      tap(() => ++counter),
      concatMap(() => {
        return this.loader.preload()
          .pipe(
            last(),
            // Catch error if we subscribed to completed stream
            catchError(() => of(null)),
          );
      }),
      tap(() => --counter),
      // Close stream if queue empty
      takeWhile(() => !!counter),
      finalize(() => {
        this.queue.remove(urlTree);
        this.loadingQueuesMap.delete(urlTree);
      })
    ).subscribe();
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
