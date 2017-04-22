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
        route: 'statistics',
        name: 'lookup-statistics',
        title: 'Lookup statistics',
        nav: true,
        moduleId: 'containers/lookup-statistics/lookup-statistics'
      },
      {
        route: 'not-found',
        name: 'not-found',
        moduleId: 'containers/general/not-found/not-found'
      }
    ]);

    config.mapUnknownRoutes('containers/general/not-found/not-found');
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
