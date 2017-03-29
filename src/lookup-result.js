/**
 * Created by Tanel.Prikk on 2/21/2017.
 */
import {EventAggregator} from 'aurelia-event-aggregator';
import {LookupStarted} from './messages';
import {WebAPI} from './web-api';

export class LookupResult {
  static inject() { return [WebAPI, EventAggregator]; }

  constructor(api, ea){
    this.api = api;
    this.ea = ea;
    this.ea.subscribe(LookupStarted, msg =>  {
      // clear old results here
    });
  }

  activate(params) {
    this.api.getLookupData(params.lookupId).then(lookupData => {
      this.lookupData = JSON.stringify(lookupData, null, ' ');
    });
  }
}
