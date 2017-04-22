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

  fetchLookup(lookupId) {
    return this.httpClient
      .fetch(`/lookups/${lookupId}`)
      .then(response => (response.json()));
  }

  postLookup(lookupData) {
    return this.httpClient
      .fetch('/lookups', {
        method: 'POST',
        body: JSON.stringify(lookupData),
        headers: {
          'Content-type': 'application/json'
        }})
      .then(response => (response.json()));
  }

  fetchDomains() {
    return this.httpClient
      .fetch('/domains')
      .then(response => (response.json()));
  }

  fetchDomainLookup(domainLookupId) {
    return this.httpClient
      .fetch(`/domain-lookups/${domainLookupId}`)
      .then(response => (response.json()));
  }

  fetchLookupStatistics(entityName, domainId) {
    return this.httpClient
      .fetch(`/lookup-entities/history?entityName=${entityName}&domainId=${domainId}`)
      .then(response => (response.json()));
  }

  fetchLookupStatisticsForEntity(entityId, domainId) {
    return this.httpClient
      .fetch(`/lookup-entities/${entityId}/history?domainId=${domainId}`)
      .then(response => (response.json()));
  }

  restartDomainLookup(domainLookupId) {
    return this.httpClient
      .fetch(`/domain-lookups/${domainLookupId}/restart`, { method: 'POST' })
      .then(response => response.json());
  }

  getDomainLookupEventSource(domainLookupId) {
    return new EventSource(
      `${environment.gatewayURL}/domain-lookups/${domainLookupId}/updates`);
  }
}
