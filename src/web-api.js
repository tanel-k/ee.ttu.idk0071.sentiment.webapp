/**
 * Created by Tanel.Prikk on 2/21/2017.
 */
let latency = 500;
let longLatency = 1000;

let businessTypes = [
	{
		code: 1,
		name: "Transport"
	},
	{
		code: 2,
		name: "E-commerce"
	},
	{
		code: 3,
		name: "Banking"
	}
];

let countries = [
	{
		code: "UK",
		name: "United Kingdom"
	},
	{
		code: "AUS",
		name: "Australia"
	},
];

let lookupResponse = {
  lookupId: 1
};

let lookupData = {
  business: {
    type: "Transport",
    country: "United Kingdom",
    name: "Dummy test"
  },
  averageSentiment: "Neutral",
  snapshotCount: 5
};

let lookupSnapshots = {
  snapshots: [
    {
      url: "http://bizreviews.com/32352",
      title: "Dummy Review 1",
      rank: 1,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Neutral",
      trustLevel: 0.067
    },
    {
      url: "http://xreviews.com/31152",
      title: "Dummy Review 2",
      rank: 2,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Neutral",
      trustLevel: 0.017
    },
    {
      url: "http://xreviews.com/31152",
      title: "Dummy Review 3",
      rank: 3,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Positive",
      trustLevel: 0.017
    },
    {
      url: "http://xreviews.com/31152",
      title: "Dummy Review 4",
      rank: 4,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Negative",
      trustLevel: 0.017
    },
    {
      url: "http://xreviews.com/31152",
      title: "Dummy Review 5",
      rank: 5,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Positive",
      trustLevel: 0.017
    }
  ]
};

/**
 * TODO: Replace mock API with actual web service
 */
export class WebAPI {
	isRequesting = false;

	getBusinessEntities() {
		this.isRequesting = true;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(businessEntities);
				this.isRequesting = false;
			}, latency);
		});
	}

	getCountries() {
		this.isRequesting = true;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(countries);
				this.isRequesting = false;
			}, latency);
		});
	}

	getBusinessTypes() {
		this.isRequesting = true;
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(businessTypes);
				this.isRequesting = false;
			}, latency);
		});
	}

	getLookupSnapshots(lookupId) {
		this.isRequesting = true;
		return new Promise(resolve => {
        setTimeout(() => {
            resolve(lookupSnapshots);
            this.isRequesting = false;
        }, latency);
      });
  }

  getLookupData(lookupId) {
    this.isRequesting = true;
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(lookupData);
          this.isRequesting = false;
        }, latency);
      });
  }

  performLookup(business) {
	  this.isRequesting = true;
	  return new Promise(resolve => {
	    setTimeout(() => {
	      resolve(lookupResponse);
	      this.isRequesting = false;
      }, longLatency);
    });
  }
}
