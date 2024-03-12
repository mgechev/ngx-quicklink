import { PRIMARY_OUTLET, Route } from '@angular/router';

export const findPath = (config: Route[], route: Route): string => {
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
    const current = (el as any)._loadedRoutes || [];
    for (const route of current) {
      if (route && route.children) {
        children = children.concat(route.children);
      }
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

  // For routes with empty paths (the resulted string will look like `///section/sub-section`)
  return path.replace(/[\/]+/, '/');
};

function isPrimaryRoute(route: Route) {
  return route.outlet === PRIMARY_OUTLET || !route.outlet;
}
