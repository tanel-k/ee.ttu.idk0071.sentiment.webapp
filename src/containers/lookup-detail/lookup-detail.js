import { inject } from 'aurelia-framework';
import { DataAPI } from '../../gateways/data/data-api';

@inject(DataAPI)
export class LookupResult {
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.api.getLookupData(params.lookupId).then(lookupData => {
      this.lookupData = JSON.stringify(lookupData, null, ' ');
    });
  }
}
