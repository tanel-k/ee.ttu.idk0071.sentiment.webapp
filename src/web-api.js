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

	getLookupData(lookupId) {
		return this.httpClient
			.fetch('lookups/' + lookupId)
			.then(response => { return response.json() });
	}

	performLookup(lookupData) {
		return this.httpClient
		.fetch('lookups', {
			method: 'POST',
			body: JSON.stringify(lookupData),
			headers: {
			'Content-type': 'application/json'
			}})
		.then(response => { return response.json() });
	}
}
