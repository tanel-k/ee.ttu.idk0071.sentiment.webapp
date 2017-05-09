import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DataAPI } from '../../gateways/data/data-api';
import { DialogService } from 'aurelia-dialog';

import moment from 'moment';

import { US_MOMENT_DATE_FORMAT } from '../../lib/date-utils';
import { blockPage, releasePage } from '../../app-utils';
import ErrorDialog from '../dialogs/error-dialog';
import HistoryDialog from './dialogs/history-dialog';

const STATE_COMPLETE = 'Complete';
const STATE_ERROR = 'Error';

@inject(DataAPI, Router, DialogService)
export class LookupDetail {
  constructor(api, router, dialogService) {
    this.api = api;
    this.router = router;
    this.dialogService = dialogService;

    this.registerDomainLookup = this.registerDomainLookup.bind(this);
  }

  activate({ lookupId }) {
    this.isLoading = true;
    this.lookupData = null;
    this.incompleteDomainLookups = [];
    this.completeDomainLookups = [];

    blockPage();
    this.api.fetchLookup(lookupId)
      .then(lookupData => {
        releasePage();
        this.isLoading = false;
        this.registerLookup(lookupData);
      })
      .catch((err) => {
        releasePage();
        this.isLoading = false;
        this.router.navigateToRoute('not-found');
      });
  }

  get hasIncompleteLookups() {
    return this.incompleteDomainLookups.length > 0;
  }

  get hasCompleteLookups() {
    return this.completeDomainLookups.length > 0;
  }

  registerLookup(lookupData) {
    this.lookupData = lookupData;
    lookupData.domainLookups.forEach(this.registerDomainLookup);
  }

  registerDomainLookup(domainLookup) {
    const { id, domainLookupState } = domainLookup;
    let currStateName = domainLookupState.name;

    if (isCompleteState(currStateName)) {
      this.registerCompleteDomainLookup(id);
      return;
    }

    const flattenedDomainLookup = flattenDomainLookup(domainLookup);
    let initialSecondsLeft;
    if (domainLookup.domain.averageDurationSeconds !== null) {
      initialSecondsLeft = domainLookup.domain.averageDurationSeconds - (new Date().getTime() - domainLookup.submittedDate) / 1000;
    } else {
      initialSecondsLeft = null;
    }

    Object.assign(flattenedDomainLookup, { initialSecondsLeft });
    this.incompleteDomainLookups.push(flattenedDomainLookup);

    const eventSource = this.api.getDomainLookupEventSource(id);
    eventSource.onerror = (error) => {
      // prevent error spam
      if (!this.eventSourceErrorOccurred) {
        this.eventSourceErrorOccurred = true;
        this.openErrorDialog('A network error has occurred. You might want to refresh the page.');
      }
    };

    eventSource.addEventListener('state', (event) => {
      currStateName = event.data;
      if (isCompleteState(currStateName)) {
        eventSource.close();
        this.registerCompleteDomainLookup(id);
      } else {
        this.incompleteDomainLookups.find(d => d.id === id)
          .currStateName = currStateName;
      }
    });
  }

  registerCompleteDomainLookup(id) {
    this.incompleteDomainLookups = this.incompleteDomainLookups
      .filter(d => d.id !== id);
    this.api.fetchDomainLookup(id)
      .then(cpltDomainLookup => {
        this.completeDomainLookups.unshift(
          extendCompleteDomainLookup(flattenDomainLookup(cpltDomainLookup))
        );
      });
  }

  showHistory(domainLookup) {
    const { domain } = domainLookup;
    const { lookupEntity } = this.lookupData;
    const title = `Sentiment history for '${lookupEntity.name}' on ${domain.name}`;
    const rangeStart = new moment().subtract(1, 'month').format(US_MOMENT_DATE_FORMAT);
    const rangeEnd = new moment().format(US_MOMENT_DATE_FORMAT);
    const subtitle = `(${rangeStart} - ${rangeEnd})`;

    this.api.fetchEntityHistoryById(lookupEntity.id, domain.code, rangeStart, rangeEnd)
      .then(statisticsResult => {
        releasePage();
        let graphData = null;
        let message = null;

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
          graphData = {
            dataSets: [
              { label: 'Positivity %', color: 'green', data: positivityPoints },
              { label: 'Neutrality %', color: 'yellow', data: neutralityPoints },
              { label: 'Negativity %', color: 'red', data: negativityPoints }
            ],
            config: graphConfig
          };
        } else {
          message = 'Insufficient historic data';
        }

        this.dialogService.open({
          viewModel: HistoryDialog,
          model: { graphData, message, title, subtitle }
        });
      })
      .catch(err => {
        releasePage();
        this.openErrorDialog('An error occurred while retrieving historic data');
      });
  }

  restartDomainLookup(id) {
    blockPage();
    this.api.restartDomainLookup(id)
      .then(domainLookup => {
        releasePage();
        this.completeDomainLookups = this.completeDomainLookups
          .filter(d => d.id !== id);
        this.registerDomainLookup(domainLookup);
      })
      .catch(err => {
        releasePage();
        this.openErrorDialog('An unknown error occurred while restarting');
      });
  }

  openErrorDialog(message) {
    this.dialogService.open({
      viewModel: ErrorDialog,
      model: { message }
    });
  }

  getUSDate(dateMillis) {
    return new moment(dateMillis).format(US_MOMENT_DATE_FORMAT);
  }
}

const isCompleteState = (stateName) => (
  stateName === STATE_COMPLETE || stateName === STATE_ERROR
);

const extendCompleteDomainLookup = (domainLookup) => {
  const chartDataItems = [
    {
      data: domainLookup.positiveCount,
      label: 'Positive',
      color: 'green'
    },
    {
      data: domainLookup.neutralCount,
      label: 'Neutral',
      color: 'yellow'
    },
    {
      data: domainLookup.negativeCount,
      label: 'Negative',
      color: 'red'
    }
  ];
  const totalCount = domainLookup.neutralCount
    + domainLookup.negativeCount
    + domainLookup.positiveCount;

  return Object.assign(domainLookup, { chartDataItems, totalCount });
};

const flattenDomainLookup = (domainLookup) => {
  const currStateName = domainLookup.domainLookupState.name;
  const domainName = domainLookup.domain.name;
  const isError = currStateName === STATE_ERROR;
  const isSuccess = currStateName === STATE_COMPLETE;

  return Object.assign({}, domainLookup, {
    isError,
    isSuccess,
    domainName,
    currStateName
  });
};

