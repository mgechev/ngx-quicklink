import { LinkDirective } from './link.directive';

export interface LinkHandlerStrategy {
  register(el: LinkDirective): void;
  unregister(el: LinkDirective): void;
  supported(): boolean;
}
