<p align="center">
  <img src="https://github.com/mgechev/ngx-quicklink/blob/master/logos/logo.png?raw=true" width="305px">
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

After that import the `QuicklinkModule` to the `AppModule`, and use the `QuicklinkStrategy` as `preloadingStrategy` in the router's configuration. For example:

```ts
// ...
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

@NgModule({
  declarations: [...],
  imports: [
    // ...
    QuicklinkModule,
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy }),
  ],
  bootstrap: [...]
})
export class AppModule {}
```

If you want to add a route in the ignore list so that `ngx-quicklink` will not preload it use the `data` property:

```ts
export const routes: Routes = [
  {
    path: 'contact',
    loadChildren: import(() => './contact/contact.module').then(m => m.ContactModule),
    data: {
      preload: false
    }
  }
];

```

**Note that to make the module available in lazy-loaded modules as well you need to import it in a shared module and export it.** Look at [this commit](https://github.com/mgechev/angular-realworld-example-app-qucklink/commit/33ea101c7d84bb5ca086f107148bbc958659f83f) to see how `ngx-quicklink` is integrated in the [angular-realworld-example-app](https://github.com/gothinkster/angular-realworld-example-app).

## Debugging

**Not getting routes preloaded?** Most likely the problem comes from a missing import of the `QuicklinkModule`. The `QuicklinkModule` exports a `LinkDirective` which matches the `[routerLink]` selector. It'll hook into all your router links in the scope of the module and observe their visibility. If you've not imported the `QuicklinkModule` correctly, this directive will be missing and the quicklink preloading strategy will not work.

**How to verify Angular has made my links "quicklinks"?** Inspect a router link and check if it has `ngx-ql` attribute. If it does not, make sure you import `QuicklinkModule` in the module that defines the compilation context of the template where the router link is. Alternatively, if the `ngx-ql` attribute is there, but the prefetching does not work as expected, please open an issue.

## Polyfills

`ngx-quicklink`:

* Includes a very small fallback for [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
* Optionally requires `IntersectionObserver` to be supported (see [CanIUse](https://caniuse.com/#feat=intersectionobserver)). On older browsers `ngx-quicklink` preloads all links on the page. If you want to enable the `IntersectionObserver` behavior on older browsers you can use conditional polyfill loading:

```html
<script src="https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver"></script>
```

Alternatively, see the [Intersection Observer polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

## FAQ

*What's the difference between quicklink and ngx-quicklink?*

>quicklink prefetches the resource pointed by the `href` attribute of an anchor. This doesn't work for Angular because the value of the `href` attribute is not a JavaScript bundle but a path defined inside of the routing configuration. ngx-quicklink introduces some additional functionality to make the same strategy work well with Angular.

*Should I use [Guess.js](https://github.com/guess-js/guess) or ngx-quicklink?*

>The prefetching behavior of Guess.js would most likely be more accurate compared to ngx-quicklink, which will reduce the overfetching. Guess.js, however, may take a little more effort to setup. In case you don't want to integrate with the analytics of your website ngx-quicklink is the right choice for you.

## Developing & releasing

For a demo:

```shell
git clone git@github.com:mgechev/ngx-quicklink
cd ngx-quicklink && npm i
ng build --project ngx-quicklink
ng serve
```

To release first update the package version and after that:

```shell
npm run release
cd dist/ngx-quicklink
npm publish
```

## Contributors

[<img alt="mgechev" src="https://avatars.githubusercontent.com/u/455023?v=4&s=117" width="117">](https://github.com/mgechev) |[<img alt="dependabot[bot]" src="https://avatars.githubusercontent.com/in/29110?v=4&s=117" width="117">](https://github.com/apps/dependabot) |[<img alt="wKoza" src="https://avatars.githubusercontent.com/u/11403260?v=4&s=117" width="117">](https://github.com/wKoza) |[<img alt="rolaveric" src="https://avatars.githubusercontent.com/u/960670?v=4&s=117" width="117">](https://github.com/rolaveric) |[<img alt="thekiba" src="https://avatars.githubusercontent.com/u/1910515?v=4&s=117" width="117">](https://github.com/thekiba) |[<img alt="Flyrell" src="https://avatars.githubusercontent.com/u/19550608?v=4&s=117" width="117">](https://github.com/Flyrell) |
:---: |:---: |:---: |:---: |:---: |:---: |
[mgechev](https://github.com/mgechev) |[dependabot[bot]](https://github.com/apps/dependabot) |[wKoza](https://github.com/wKoza) |[rolaveric](https://github.com/rolaveric) |[thekiba](https://github.com/thekiba) |[Flyrell](https://github.com/Flyrell) |

[<img alt="Niaro" src="https://avatars.githubusercontent.com/u/7147943?v=4&s=117" width="117">](https://github.com/Niaro) |[<img alt="krzysztof-grzybek" src="https://avatars.githubusercontent.com/u/6236664?v=4&s=117" width="117">](https://github.com/krzysztof-grzybek) |[<img alt="tarsinzer" src="https://avatars.githubusercontent.com/u/21989873?v=4&s=117" width="117">](https://github.com/tarsinzer) |[<img alt="mehmet-erim" src="https://avatars.githubusercontent.com/u/34455572?v=4&s=117" width="117">](https://github.com/mehmet-erim) |[<img alt="Timebutt" src="https://avatars.githubusercontent.com/u/10674081?v=4&s=117" width="117">](https://github.com/Timebutt) |[<img alt="pshurygin" src="https://avatars.githubusercontent.com/u/25816676?v=4&s=117" width="117">](https://github.com/pshurygin) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Niaro](https://github.com/Niaro) |[krzysztof-grzybek](https://github.com/krzysztof-grzybek) |[tarsinzer](https://github.com/tarsinzer) |[mehmet-erim](https://github.com/mehmet-erim) |[Timebutt](https://github.com/Timebutt) |[pshurygin](https://github.com/pshurygin) |

[<img alt="thomashuston" src="https://avatars.githubusercontent.com/u/733696?v=4&s=117" width="117">](https://github.com/thomashuston) |[<img alt="Komock" src="https://avatars.githubusercontent.com/u/7387686?v=4&s=117" width="117">](https://github.com/Komock) |[<img alt="jlilly" src="https://avatars.githubusercontent.com/u/2780209?v=4&s=117" width="117">](https://github.com/jlilly) |
:---: |:---: |:---: |
[thomashuston](https://github.com/thomashuston) |[Komock](https://github.com/Komock) |[jlilly](https://github.com/jlilly) |

## License

MIT
