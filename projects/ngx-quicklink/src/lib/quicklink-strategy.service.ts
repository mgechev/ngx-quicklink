import { Injectable } from '@angular/core';
import { PreloadingStrategy, Router, Route } from '@angular/router';
import { PrefetchRegistry } from './prefetch-registry.service';
import { EMPTY } from 'rxjs';
import { findPath } from './utils/find-path';

@Injectable({ providedIn: 'root' })
export class QuicklinkStrategy implements PreloadingStrategy {
  loading = new Set<Route>();

  constructor(private registry: PrefetchRegistry, private router: Router) {}

  preload(route: Route, load: Function) {
    if (this.loading.has(route)) {
      // Don't preload the same route twice
      return EMPTY;
    }
    const conn =
      typeof navigator !== 'undefined'
        ? (navigator as any).connection
        : undefined;
    if (conn) {
      // Don't preload if the user is on 2G. or if Save-Data is enabled..
      if ((conn.effectiveType || '').includes('2g') || conn.saveData)
        return EMPTY;
    }
    // Prevent from preloading
    if (route.data && route.data['preload'] === false) {
      return EMPTY;
    }
    const fullPath = findPath(this.router.config, route);
    if (this.registry.shouldPrefetch(fullPath)) {
      this.loading.add(route);
      return load();
    }

    return EMPTY;
  }
}
