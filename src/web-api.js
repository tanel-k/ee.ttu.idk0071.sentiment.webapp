/**
 * Created by Tanel.Prikk on 2/21/2017.
 * 
 * 07/03/2017	IDKPR-44: use injection
 */
import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import environment from './environment';

@inject(HttpClient)
export class WebAPI {
	constructor(httpClient) {
		this.httpClient = httpClient.configure(config => config
					.useStandardConfiguration()
					.withBaseUrl(environment.gatewayURL)
				);
	}

	isRequesting() {
		return this.httpClient.isRequesting;
	}

	getCountries() {
		return this.httpClient
			.fetch('classifiers/countries')
			.then(response => { return response.json() });
	}

	getBusinessTypes() {
		return this.httpClient
			.fetch('classifiers/business-types')
			.then(response => { return response.json() });
	}

	getLookupSnapshots(lookupId) {
		return this.httpClient
			.fetch('lookups/' + lookupId + '/snapshots')
			.then(response => { return response.json() });
	}

	getLookupData(lookupId) {
		return this.httpClient
			.fetch('lookups/' + lookupId)
			.then(response => { return response.json() });
	}

	performLookup(business) {
		return this.httpClient
		.fetch('lookups', {
			method: 'POST',
			body: JSON.stringify(business),
			headers: {
			'Content-type': 'application/json'
			}})
		.then(response => { return response.json() });
	}
}
