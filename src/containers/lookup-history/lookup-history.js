import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DataAPI } from '../../gateways/data/data-api';
import { DialogService } from 'aurelia-dialog';

import moment from 'moment';
import 'jquery';

import { isEmpty } from '../../lib/utils';
import { isUSDateString, US_MOMENT_DATE_FORMAT } from '../../lib/date-utils';
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
    this.isSpecifyDateMode = false;
    this.fromDate = new moment().subtract(1, 'month').format(US_MOMENT_DATE_FORMAT);
    this.toDate = new moment().format(US_MOMENT_DATE_FORMAT);

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

    const defaultRangeStartMmt = new moment().subtract(1, 'month');
    const defaultRangeEndMmt = new moment();
    let rangeStart = defaultRangeStartMmt.format(US_MOMENT_DATE_FORMAT);
    let rangeEnd = defaultRangeEndMmt.format(US_MOMENT_DATE_FORMAT);

    if (this.isSpecifyDateMode) {
      if (isEmpty(this.fromDate) && isEmpty(this.toDate)) {
        this.fromDate = rangeStart;
        this.toDate = rangeEnd;
      } else if (isEmpty(this.toDate)) {
        this.toDate = moment(this.fromDate, US_MOMENT_DATE_FORMAT)
          .add(1, 'month')
          .format(US_MOMENT_DATE_FORMAT);
      } else if (isEmpty(this.fromDate)) {
        this.fromDate = moment(this.toDate, US_MOMENT_DATE_FORMAT)
          .subtract(1, 'month')
          .format(US_MOMENT_DATE_FORMAT);
      }

      rangeStart = this.fromDate;
      rangeEnd = this.toDate;
    }

    this.api.fetchEntityHistoryByName(this.entityName, this.domainId, rangeStart, rangeEnd)
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
        this.rangeLabel = `(${rangeStart} - ${rangeEnd})`;
      })
      .catch(err => {
        if (err.status && err.status === 404) {
          this.searchTitle = 'Historic sentiment data for ' + this.entityName;
          this.searchMessage = 'No historic data found';
          this.rangeLabel = `(${rangeStart} - ${rangeEnd})`;
        } else {
          this.openErrorDialog(MSG_SEARCH_ERR);
        }

        releasePage();
      });
  }

  handleSearchRefineClick() {
    this.isSpecifyDateMode = !this.isSpecifyDateMode;
  }

  validateFormDate(formDateKey) {
    const isValid = isEmpty(this[formDateKey]) || isUSDateString(this[formDateKey]);
    this[`${formDateKey}Valid`] = isValid;
    if (isValid) {
      this[`${formDateKey}ErrorMsg`] = '';
    } else {
      this[`${formDateKey}ErrorMsg`] = 'This is not a valid date (dd/mm/yyyy)';
    }
    return isValid;
  }

  validateFormDateRange() {
    let datesValid = true;
    datesValid &= this.validateFormDate('fromDate');
    datesValid &= this.validateFormDate('toDate');
    if (datesValid) {
      const fromDate = moment(this.fromDate, US_MOMENT_DATE_FORMAT);
      const toDate = moment(this.toDate, US_MOMENT_DATE_FORMAT);
      if (toDate.diff(fromDate) < 0) {
        this.toDateValid = false;
        this.toDateErrorMsg = 'End date should not precede to start date';
        datesValid = false;
      }
    }
    return datesValid;
  }

  get canSearch() {
    return (!this.isSpecifyDateMode || this.validateFormDateRange()) && !isEmpty(this.entityName) && !isEmpty(this.domainId);
  }

  openErrorDialog(message) {
    this.dialogService.open({
      viewModel: ErrorDialog,
      model: { message }
    });
  }
}
