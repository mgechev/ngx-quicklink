# ngx-quicklink

Angular implementation for [quicklink](https://github.com/GoogleChromeLabs/quicklink).

## How it works

Quicklink attempts to make navigations to subsequent pages load faster. It:

* **Detects `routerLink`s within the viewport** (using [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API))
* **Waits until the browser is idle** (using [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback))
* **Checks if the user isn't on a slow connection** (using `navigator.connection.effectiveType`) or has data-saver enabled (using `navigator.connection.saveData`)
* **Prefetches the lazy loaded modules** using Angular's prefetching strategy)

## Why

This project aims to be a drop-in solution for sites to prefetch links based on what is in the user's viewport. It also aims to be small (**~2KB minified/gzipped**).

## Usage

First you need to install the project:

```bash
npm i ngx-quicklink --save
```

After that import the `QuicklinkModule` to the `AppComponent`, and use the `QuicklinkStrategy` as `preloadingStrategy` in the router's config:

```ts
// ...
import {QuicklinkModule, QuicklinkStrategy} from 'ngx-quicklink';

@NgModule({
  declarations: [...],
  imports: [
    // ...
    QuicklinkModule,
    RouterModule.forRoot(routes, {preloadingStrategy: QuicklinkStrategy}),
  ],
  bootstrap: [...]
})
export class AppModule { }
```

## Polyfills

`quicklink`:

* Includes a very small fallback for [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
* Requires `IntersectionObserver` to be supported (see [CanIUse](https://caniuse.com/#feat=intersectionobserver)). We recommend conditionally polyfilling this feature with a service like Polyfill.io:

```html
<script src="https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver"></script>
```

Alternatively, see the [Intersection Observer polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

## License

MIT
