import { Injectable } from "@angular/core";
import { LinkDirective } from "./link.directive";
import { RouterPreloader } from "@angular/router";
import { PrefetchRegistry } from "./prefetch-registry.service";

@Injectable()
export class LinkHandler {
  private registerIdle: any;
  private unregisterIdle: any;
  private registerBuffer: Element[] = [];
  private unregisterBuffer: Element[] = [];
  private elementLink = new Map<Element, LinkDirective>();
  private observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target as HTMLAnchorElement;
        this.queue.add(this.elementLink.get(link).urlTree);
        this.observer.unobserve(link);
        window.requestIdleCallback(() => {
          this.loader.preload().subscribe(() => void 0);
        });
      }
    });
  });

  constructor(private loader: RouterPreloader, private queue: PrefetchRegistry) {}

  register(el: LinkDirective) {
    this.elementLink.set(el.element, el);
    window.cancelIdleCallback(this.registerIdle);
    this.registerBuffer.push(el.element);
    this.registerIdle = window.requestIdleCallback(() => {
      this.registerBuffer.forEach(e => {
        this.observer.observe(e);
      });
      this.registerBuffer = [];
    })
  }

  unregister(el: LinkDirective) {
    this.elementLink.delete(el.element);
    window.cancelIdleCallback(this.unregisterIdle);
    this.unregisterBuffer.push(el.element);
    this.unregisterIdle = window.requestIdleCallback(() => {
      this.unregisterBuffer.forEach(e => {
        this.observer.observe(e);
      });
      this.unregisterBuffer = [];
    })
  }
}
