import {NgModule} from "@angular/core";
import {LinkDirective} from "./link.directive";
import {LinkHandler} from "./link-handler.service";
import {PrefetchRegistry} from './prefetch-registry.service';
import {QuicklinkStrategy} from "./quicklink-strategy.service";

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
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}

@NgModule({
  declarations: [LinkDirective],
  providers: [LinkHandler, PrefetchRegistry, QuicklinkStrategy],
  exports: [LinkDirective]
})
export class QuicklinkModule {}

