import { Injectable } from '@angular/core';
import { PreloadingStrategy, Router, Route } from '@angular/router';
import { PrefetchRegistry } from './prefetch-registry.service';
import { EMPTY } from 'rxjs';

@Injectable()
export class QuicklinkStrategy implements PreloadingStrategy {
  constructor(private queue: PrefetchRegistry, private router: Router) {}

  preload(route: Route, load: Function) {
    const conn = (navigator as any).connection;
    if (conn) {
      // Don't preload if the user is on 2G. or if Save-Data is enabled..
      if ((conn.effectiveType || '').includes('2g') || conn.saveData) return EMPTY;
    }
    // Allow preload blacklisting
    if (route.data && !route.data.preload) {
      return EMPTY;
    }
    const fullPath = findPath(this.router.config, route);
    // TODO(mgechev): make sure it works for parameterized routes
    if (this.queue.shouldPrefetch(fullPath)) {
      return load();
    }
    return EMPTY;
  }
}

const findPath = (config: Route[], route: Route): string => {
  config = config.slice();
  const parent = new Map<Route, Route>();
  while (config.length) {
    const el = config.shift();
    if (el === route) break;
    const current = (el as any)._loadedConfig;
    if (!current || !current.routes) continue;
    current.routes.forEach((r: Route) => {
      parent.set(r, el);
      config.push(r);
    });
  }
  const segments: string[] = [];
  let current = route;
  while (current) {
    segments.unshift(current.path);
    current = parent.get(current);
  }
  return '/' + segments.join('/');
};
