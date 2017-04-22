import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DataAPI } from '../../gateways/data/data-api';
import { DialogService } from 'aurelia-dialog';

import { isEmpty } from '../../lib/utils';
import { blockPage, releasePage } from '../../app-utils';
import ErrorDialog from '../dialogs/error-dialog';

import { MSG_NETWORK_ERR, MSG_SEARCH_ERR } from '../../consts/messages';

@inject(DataAPI, Router, DialogService)
export class LookupStatistics {
  constructor(api, router, dialogService) {
    this.api = api;
    this.router = router;
    this.dialogService = dialogService;
  }

  attached() {
    blockPage();
    this.api.fetchDomains()
      .then((domains) => {
        releasePage();
        this.domainOptions = domains.map(d => ({
          label: d.name,
          value: d.code
        }));
      })
      .catch((err) => {
        releasePage();
        this.openErrorDialog(MSG_NETWORK_ERR);
      });
  }

  performSearch() {
    this.api.fetchLookupStatistics(this.entityName, this.domainId)
      .then(statisticsResult => {
        releasePage();
        // TODO: wait for endpoint logic to be completed
      })
      .catch(err => {
        releasePage();
        this.openErrorDialog(MSG_SEARCH_ERR);
      });
  }

  get canSearch() {
    return !isEmpty(this.entityName)
      && this.domainId > 0;
  }

  openErrorDialog(message) {
    this.dialogService.open({
      viewModel: ErrorDialog,
      model: { message }
    });
  }
}
