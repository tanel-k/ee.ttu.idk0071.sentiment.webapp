import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';

import 'jquery';
import blockUI from 'blockUI';

import { DataAPI } from '../../gateways/data/data-api';
import { isEmpty } from '../../lib/utils';
import LookupSubmitted from './dialogs/lookup-submitted';


@inject(DataAPI, Router, DialogService)
export class LookupForm {
  constructor(api, router, dialogService) {
    this.api = api;
    this.router = router;
    this.dialogService = dialogService;

    this.entityName = '';
    this.domainIds = [];
  }

  created() {
    this.api.fetchDomains()
      .then((domains) => {
        this.domainOptions = domains.map(d => ({
          label: d.name,
          value: d.code
        }));
      })
      .catch((err) => {
       // cannot recover
      });
  }

  get canLookup() {
    return !isEmpty(this.entityName)
      && this.domainIds.length > 0;
  }

  performLookup() {
    blockPage();
    const { entityName, domainIds } = this;

    this.api.postLookup({ entityName, domainIds })
      .then(lookupResult => {
        releasePage();
        this.domainIds = [];
        this.entityName = '';
        this.openResultDialog({ lookupResult, entityName });
      })
      .catch(err => {

      });
  }

  openResultDialog(model) {
    this.dialogService.open({
      viewModel: LookupSubmitted,
      model: model
    });
  }
}

const blockPage = () => {
  $.blockUI({ message: null });
};

const releasePage = () => {
  $.unblockUI();
};
