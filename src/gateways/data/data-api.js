import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import environment from '../../environment';

@inject(HttpClient)
export class DataAPI {

  constructor(httpClient) {
    this.httpClient = httpClient.configure(config => config
          .useStandardConfiguration()
          .withBaseUrl(environment.gatewayURL)
        );
  }

  isRequesting() {
    return this.httpClient.isRequesting;
  }

  getLookupData(lookupId) {
    return this.httpClient
      .fetch('lookups/' + lookupId)
      .then(response => (response.json()));
  }

  performLookup(lookupData) {
    return this.httpClient
    .fetch('lookups', {
      method: 'POST',
      body: JSON.stringify(lookupData),
      headers: {
        'Content-type': 'application/json'
      }})
    .then(response => (response.json()));
  }
}
