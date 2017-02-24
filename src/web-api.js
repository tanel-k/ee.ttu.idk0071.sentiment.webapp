/**
 * Created by Tanel.Prikk on 2/21/2017.
 */
import {HttpClient, json} from 'aurelia-fetch-client';

export class WebAPI {
  httpClient = new HttpClient();

  isRequesting() {
    return this.httpClient.isRequesting;
  }

	getCountries() {
    return this.httpClient
      .fetch('http://localhost:8080/classifiers/countries')
      .then(response => { return response.json() });
	}

	getBusinessTypes() {
    return this.httpClient
      .fetch('http://localhost:8080/classifiers/business-types')
      .then(response => { return response.json() });
	}

	getLookupSnapshots(lookupId) {
    return this.httpClient
      .fetch('http://localhost:8080/lookups/' + lookupId + '/snapshots')
      .then(response => { return response.json() });
  }

  getLookupData(lookupId) {
    return this.httpClient
      .fetch('http://localhost:8080/lookups/' + lookupId)
      .then(response => { return response.json() });
  }

  performLookup(business) {
    return this.httpClient
      .fetch('http://localhost:8080/lookups', {
        method: 'POST',
        body: JSON.stringify(business),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(response => { return response.json() });
  }
}
