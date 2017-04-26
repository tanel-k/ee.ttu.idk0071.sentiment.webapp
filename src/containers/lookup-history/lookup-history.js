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
    if (!this.canSearch) {
      return;
    }

    blockPage();
    this.graphData = null;
    this.searchTitle = null;
    this.searchMessage = null;

    this.api.fetchEntityResultsByName(this.entityName, this.domainId)
      .then(statisticsResult => {
        releasePage();
        if (statisticsResult.length > 2) {
          const positivityPoints = statisticsResult.map(item => ({ y: item.positivityPercentage, x: new Date(item.date) }));
          const negativityPoints = statisticsResult.map(item => ({ y: item.negativityPercentage, x: new Date(item.date) }));
          const neutralityPoints = statisticsResult.map(item => ({ y: item.neutralityPercentage, x: new Date(item.date) }));
          const graphConfig = {
            title: '',
            xConfig: {
              type: 'time',
              label: 'Time'
            },
            yConfig: {
              label: '%'
            }
          };
          this.graphData = {
            dataSets: [
              { label: 'Positivity %', color: 'green', data: positivityPoints },
              { label: 'Neutrality %', color: 'yellow', data: neutralityPoints },
              { label: 'Negativity %', color: 'red', data: negativityPoints }
            ],
            config: graphConfig
          };
        } else {
          this.searchMessage = 'Insufficient historic data';
        }

        this.searchTitle = 'Historic sentiment data for ' + this.entityName;
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
