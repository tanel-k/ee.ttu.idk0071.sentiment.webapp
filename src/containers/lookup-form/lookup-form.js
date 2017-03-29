import { inject } from 'aurelia-framework';
import { isEmpty } from '../../lib/utils';
import { Router } from 'aurelia-router';

import 'jquery';
import blockUI from 'blockUI';

import { DataAPI } from '../../gateways/data/data-api';

@inject(DataAPI, Router)
export class LookupForm {
  constructor(api, router) {
    this.api = api;
    this.router = router;
    this.entityName = '';
  }

  get canLookup() {
    return !isEmpty(this.entityName);
  }

  performLookup() {
    blockPage();

    this.api.performLookup({
      entityName: this.entityName,
      domainIds: []
    }).then(lookupResult => {
      releasePage();
      this.router.navigate(`lookups/${lookupResult.id}`);
    });
  }
}

function blockPage() {
  $.blockUI({ message: null });
}

function releasePage() {
  $.unblockUI();
}
