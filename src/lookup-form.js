/**
 * Created by Tanel.Prikk on 2/21/2017.
 */
import {inject} from 'aurelia-framework';
import {WebAPI} from './web-api';
import {isEmpty} from './utils';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LookupStarted} from './messages';
import 'jquery';
import blockUI from 'blockUI';

@inject(WebAPI, Router, EventAggregator)
export class LookupForm {
	constructor(api, router, ea) {
		this.api = api;
		this.router = router;
		this.ea = ea;

		this.entityName = '';
	}

	created() {

	}

	get canLookup() {
		return !isEmpty(this.entityName)
	}

	performLookup() {
		this.ea.publish(new LookupStarted());
		blockPage();
		
		this.api.performLookup({
			entityName: this.entityName,
			domainIds: []
		})
		.then(lookupResult => {
			releasePage();
			this.router.navigate("lookups/" + lookupResult.id);
		});
	}
}

function blockPage() {
	$.blockUI({ message: null });
}

function releasePage() {
	$.unblockUI();
}