/**
 * Created by Tanel.Prikk on 2/21/2017.
 * 
 * 07/03/2017	IDKPR-44: use injection
 */
import {inject} from 'aurelia-framework';
import {WebAPI} from './web-api';

@inject(WebAPI)
export class App {

	constructor(api) {
		this.api = api;
	}

	configureRouter(config, router) {
		config.title = 'Sentimental.ly';
		config.map([
			{
				route: '',
				moduleId: 'no-lookup', 
				title: 'Lookups'
			},
			{
				route: 'lookups/:lookupId',
				moduleId: 'lookup-result',
				name: 'lookups'
			}
		]);

		this.router = router;
	}
}
