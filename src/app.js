import { inject, bindable, bindingMode } from 'aurelia-framework';
import { DataAPI } from './gateways/data/data-api';

@inject(DataAPI)
export class App {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) lookupIdSearch = '';
  isSearching = false;

  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Sentimental.ly';

    config.map([
      {
        route: '',
        name: 'main',
        moduleId: 'containers/main-page/main-page'
      },
      {
        route: 'new-lookup',
        name: 'lookup-form',
        title: 'New lookup',
        nav: true,
        moduleId: 'containers/lookup-form/lookup-form'
      },
      {
        route: 'lookups/:lookupId',
        name: 'lookup-detail',
        moduleId: 'containers/lookup-detail/lookup-detail'
      },
      {
        route: 'history',
        name: 'lookup-history',
        title: 'Historic data',
        nav: true,
        moduleId: 'containers/lookup-history/lookup-history'
      },
      {
        route: 'not-found',
        name: 'not-found',
        moduleId: 'containers/general/not-found/not-found'
      }
    ]);

    config.mapUnknownRoutes('containers/general/not-found/not-found');
  }

  attached() {
    //Hotjar Tracking Code moved from index
    ((h, o, t, j, a, r) => {
      h.hj = h.hj || (() => { (h.hj.q = h.hj.q || []).push(arguments); });
      h._hjSettings = { hjid: 498271, hjsv: 5 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  searchForLookup() {
    if (this.lookupIdSearch && this.lookupIdSearch.trim()) {
      this.isSearching = true;
      this.api.fetchLookup(this.lookupIdSearch.trim())
        .then((response) => {
          this.router.navigateToRoute('lookup-detail', { lookupId: response.id });
          this.lookupIdSearch = '';
          this.isSearching = false;
        })
        .catch((err) => {
          this.isSearching = false;
        });
    }
  }
}
