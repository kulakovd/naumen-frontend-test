import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { NgModuleRef } from '@angular/core';

declare global {
  interface Window {
    ngRef: NgModuleRef<AppModule>;
  }
}

platformBrowserDynamic().bootstrapModule(AppModule).then((ref: NgModuleRef<AppModule>) => {
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;

  // Otherwise, log the boot error
}).catch((err: unknown) => console.error(err));
