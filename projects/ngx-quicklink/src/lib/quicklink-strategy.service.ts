import { Injectable } from '@angular/core';
import { PreloadingStrategy, Router, Route, PRIMARY_OUTLET } from '@angular/router';
import { PrefetchRegistry } from './prefetch-registry.service';
import { EMPTY } from 'rxjs';

@Injectable()
export class QuicklinkStrategy implements PreloadingStrategy {
  loading = new Set<Route>();

  constructor(
    private registry: PrefetchRegistry,
    private router: Router,
  ) {}

  preload(route: Route, load: Function) {
    if (this.loading.has(route)) {
      // Don't preload the same route twice
      return EMPTY;
    }
    const conn = typeof navigator !== 'undefined' ? (navigator as any).connection : undefined;
    if (conn) {
      // Don't preload if the user is on 2G. or if Save-Data is enabled..
      if ((conn.effectiveType || '').includes('2g') || conn.saveData) return EMPTY;
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

const findPath = (config: Route[], route: Route): string => {
  config = config.slice();
  const parent = new Map<Route, Route>();
  const visited = new Set<Route>();
  while (config.length) {
    const el = config.shift();
    if (!el) {
      continue;
    }
    visited.add(el);
    if (el === route) break;
    let children = el.children || [];
    const current = (el as any)._loadedConfig;
    if (current && current.routes) {
      children = children.concat(current.routes);
    }
    children.forEach((r: Route) => {
      if (visited.has(r)) return;
      parent.set(r, el);
      config.push(r);
    });
  }
  let path = '';
  let current: Route | undefined = route;

  while (current) {
    if (isPrimaryRoute(current)) {
      path = `/${current.path}${path}`;
    } else {
      path = `/(${current.outlet}:${current.path}${path})`;
    }
    current = parent.get(current);
  }

  return path.replace(/\/\//, '/');
};

function isPrimaryRoute(route: Route) {
  return route.outlet === PRIMARY_OUTLET || !route.outlet;
}
