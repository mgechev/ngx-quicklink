<p align="center">
  <img src="logos/logo.svg" width="450px">
</div>

# ngx-quicklink

[quicklink](https://github.com/GoogleChromeLabs/quicklink) implementation for Angular. It provides router preloading strategy which automatically downloads the lazy-loaded modules associated with all the visible links on the screen.

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

After that import the `QuicklinkModule` to the `AppComponent`, and use the `QuicklinkStrategy` as `preloadingStrategy` in the router's configuration. For example:

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

**Note that to make the module available in lazy-loaded modules as well you need to import it in a shared module and export it.** Look at [this commit](https://github.com/mgechev/angular-realworld-example-app-qucklink/commit/33ea101c7d84bb5ca086f107148bbc958659f83f) to see how `ngx-quicklink` is integrated in the [angular-realworld-example-app](https://github.com/gothinkster/angular-realworld-example-app).

For a demo, look at the `example` directory. To run the project use:

```
cd ngx-quicklink && npm i && npm run release
cd example && npm i && ng serve
```

## Polyfills

`quicklink`:

* Includes a very small fallback for [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
* Requires `IntersectionObserver` to be supported (see [CanIUse](https://caniuse.com/#feat=intersectionobserver)). We recommend conditionally polyfilling this feature with a service like Polyfill.io:

```html
<script src="https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver"></script>
```

Alternatively, see the [Intersection Observer polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

## FAQ

*What's the difference between quicklink and ngx-quicklink?*

>quicklink prefetches the resource pointed by the `href` attribute of an anchor. This doesn't work for Angular because the value of the `href` attribute is not a JavaScript bundle but a path defined inside of the routing configuration. ngx-quicklink introduces some additional functionality to make the same strategy work well with Angular.

*Should I use [Guess.js](https://github.com/guess-js/guess) or ngx-quicklink?*

>The prefetching behavior of Guess.js would most likely be more accurate compared to ngx-quicklink, which will reduce the overfetching. Guess.js, however, may take a little more effort to setup. In case you don't want to integrate with the analytics of your website ngx-quicklink is the right choice for you.

## License

MIT

