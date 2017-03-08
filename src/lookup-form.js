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
	}

	created() {
		this.api.getBusinessTypes().then(types => {
				this.types = types.map(x => {
					return { name: x.name, value: x.id };
				});
				this.types.unshift({});
			});

		this.api.getCountries().then(countries => {
				this.countries = countries.map(x => {
					return { name: x.name, value: x.code };
			});
			this.countries.unshift({});
		});
	}

	get canLookup() {
		return this.typeId
			&& this.countryId
			&& !isEmpty(this.businessName)
			&& !this.api.isRequesting();
	}

	performLookup() {
		this.ea.publish(new LookupStarted());
		blockPage();
		
		this.api.performLookup({
			countryCode: this.countryId,
			businessTypeId: this.typeId,
			businessName: this.businessName
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