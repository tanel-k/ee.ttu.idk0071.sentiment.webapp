import {WebAPI} from './web-api';

export class App {
  static inject() { return [WebAPI]; }

  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router) {
    config.title = 'Sentimental.ly';
    config.map([
      { route: '', moduleId: 'no-lookup', title: 'Lookups'},
      { route: 'lookups/:lookupId', moduleId: 'lookup-result', name: 'lookups' }
    ]);

    this.router = router;
  }
}
