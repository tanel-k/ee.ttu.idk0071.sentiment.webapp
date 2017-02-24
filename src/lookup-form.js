/**
 * Created by Tanel.Prikk on 2/21/2017.
 */
import {WebAPI} from './web-api';
import {isEmpty} from './utils';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LookupStarted} from './messages';

export class LookupForm {
	static inject() { return [WebAPI, Router, EventAggregator] };

	constructor(api, router, ea) {
		this.api = api;
		this.router = router;
		this.ea = ea;
	}

	created() {
		this.api.getBusinessTypes().then(types => {
				this.bussinessTypes = types.map(x => {
					return { name: x.name, value: x.id };
				});
			});

		this.api.getCountries().then(countries => {
				this.countries = countries.map(x => {
					return { name: x.name, value: x.code }
			});
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

    this.api.performLookup({
      countryCode: this.countryId,
      businessTypeId: this.typeId,
      businessName: this.businessName
    }).then(lookupResult => {
      this.router.navigate("lookups/" + lookupResult.id);
    });
	}
}
