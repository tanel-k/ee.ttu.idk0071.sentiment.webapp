define('app',['exports', './web-api'], function (exports, _webApi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    App.inject = function inject() {
      return [_webApi.WebAPI];
    };

    function App(api) {
      _classCallCheck(this, App);

      this.api = api;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Sentimental.ly';
      config.map([{ route: '', moduleId: 'no-lookup', title: 'Lookups' }, { route: 'lookups/:lookupId', moduleId: 'lookup-result', name: 'lookups' }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('lookup-form',['exports', './web-api', './utils', 'aurelia-router', 'aurelia-event-aggregator', './messages'], function (exports, _webApi, _utils, _aureliaRouter, _aureliaEventAggregator, _messages) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.LookupForm = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var LookupForm = exports.LookupForm = function () {
		LookupForm.inject = function inject() {
			return [_webApi.WebAPI, _aureliaRouter.Router, _aureliaEventAggregator.EventAggregator];
		};

		function LookupForm(api, router, ea) {
			_classCallCheck(this, LookupForm);

			this.api = api;
			this.router = router;
			this.ea = ea;
		}

		LookupForm.prototype.created = function created() {
			var _this = this;

			this.api.getBusinessTypes().then(function (types) {
				_this.bussinessTypes = types.map(function (x) {
					return { name: x.name, value: x.code };
				});
			});

			this.api.getCountries().then(function (countries) {
				_this.countries = countries.map(function (x) {
					return { name: x.name, value: x.code };
				});
			});
		};

		LookupForm.prototype.performLookup = function performLookup() {
			var _this2 = this;

			this.ea.publish(new _messages.LookupStarted());

			this.api.performLookup({
				countryId: this.countryId,
				typeId: this.typeId,
				name: this.businessName
			}).then(function (lookupResult) {
				_this2.router.navigate("lookups/" + lookupResult.lookupId);
			});
		};

		_createClass(LookupForm, [{
			key: 'canLookup',
			get: function get() {
				return this.typeId && this.countryId && !(0, _utils.isEmpty)(this.businessName) && !this.api.isRequesting;
			}
		}]);

		return LookupForm;
	}();
});
define('lookup-result',['exports', 'aurelia-event-aggregator', './messages', './web-api'], function (exports, _aureliaEventAggregator, _messages, _webApi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LookupResult = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LookupResult = exports.LookupResult = function () {
    LookupResult.inject = function inject() {
      return [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator];
    };

    function LookupResult(api, ea) {
      _classCallCheck(this, LookupResult);

      this.api = api;
      this.ea = ea;
      this.ea.subscribe(_messages.LookupStarted, function (msg) {});
    }

    LookupResult.prototype.activate = function activate(params) {
      var _this = this;

      this.api.getLookupData(params.lookupId).then(function (lookupData) {
        _this.lookupData = lookupData;
      });

      return this.api.getLookupSnapshots(params.lookupId).then(function (snapshotsResult) {
        _this.snapshots = snapshotsResult.snapshots;
      });
    };

    return LookupResult;
  }();
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LookupStarted = exports.LookupStarted = function LookupStarted() {
    _classCallCheck(this, LookupStarted);
  };
});
define('no-lookup',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NoLookup = exports.NoLookup = function NoLookup() {
    _classCallCheck(this, NoLookup);

    this.message = "Use the form to see what other people think.";
  };
});
define('utils',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isEmpty = isEmpty;
  function isEmpty(val) {
    return !val || !val.trim();
  }
});
define('web-api',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var latency = 500;
  var longLatency = 1000;

  var businessTypes = [{
    code: 1,
    name: "Transport"
  }, {
    code: 2,
    name: "E-commerce"
  }, {
    code: 3,
    name: "Banking"
  }];

  var countries = [{
    code: "UK",
    name: "United Kingdom"
  }, {
    code: "AUS",
    name: "Australia"
  }];

  var lookupResponse = {
    lookupId: 1
  };

  var lookupData = {
    business: {
      type: "Transport",
      country: "United Kingdom",
      name: "Dummy test"
    },
    averageSentiment: "Neutral",
    snapshotCount: 5
  };

  var lookupSnapshots = {
    snapshots: [{
      url: "http://bizreviews.com/32352",
      title: "Dummy Review 1",
      rank: 1,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Neutral",
      trustLevel: 0.067
    }, {
      url: "http://xreviews.com/31152",
      title: "Dummy Review 2",
      rank: 2,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Neutral",
      trustLevel: 0.017
    }, {
      url: "http://xreviews.com/31152",
      title: "Dummy Review 3",
      rank: 3,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Positive",
      trustLevel: 0.017
    }, {
      url: "http://xreviews.com/31152",
      title: "Dummy Review 4",
      rank: 4,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Negative",
      trustLevel: 0.017
    }, {
      url: "http://xreviews.com/31152",
      title: "Dummy Review 5",
      rank: 5,
      lookupDomain: "Google",
      time: "2012-04-23T18:25:43.511Z",
      sentiment: "Positive",
      trustLevel: 0.017
    }]
  };

  var WebAPI = exports.WebAPI = function () {
    function WebAPI() {
      _classCallCheck(this, WebAPI);

      this.isRequesting = false;
    }

    WebAPI.prototype.getBusinessEntities = function getBusinessEntities() {
      var _this = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(businessEntities);
          _this.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.getCountries = function getCountries() {
      var _this2 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(countries);
          _this2.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.getBusinessTypes = function getBusinessTypes() {
      var _this3 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(businessTypes);
          _this3.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.getLookupSnapshots = function getLookupSnapshots(lookupId) {
      var _this4 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(lookupSnapshots);
          _this4.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.getLookupData = function getLookupData(lookupId) {
      var _this5 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(lookupData);
          _this5.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.performLookup = function performLookup(business) {
      var _this6 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(lookupResponse);
          _this6.isRequesting = false;
        }, longLatency);
      });
    };

    return WebAPI;
  }();
});
define('resources/index',['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.configure = configure;
	function configure(config) {
		config.globalResources(['./elements/loading-indicator']);
	}
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.LoadingIndicator = undefined;

	var nprogress = _interopRequireWildcard(_nprogress);

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var LoadingIndicator = exports.LoadingIndicator = (0, _aureliaFramework.decorators)((0, _aureliaFramework.noView)(['nprogress/nprogress.css']), (0, _aureliaFramework.bindable)({ name: 'loading', defaultValue: false })).on(function () {
		function _class() {
			_classCallCheck(this, _class);
		}

		_class.prototype.loadingChanged = function loadingChanged(newValue) {
			if (newValue) {
				nprogress.start();
			} else {
				nprogress.done();
			}
		};

		return _class;
	}());
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"./styles.css\"></require><require from=\"./lookup-form\"></require><require from=\"./lookup-result\"></require><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-user\"></i> <span>Sentimental.ly</span></a></div></nav><loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator><div class=\"container\"><div class=\"row\"><lookup-form class=\"col-md-4\"></lookup-form><router-view class=\"col-md-8\"></router-view></div></div></template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\nsection {\n  margin: 0 20px;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\n.form-group.required .control-label:after {\n  content:\"*\";\n  color:red;\n}\n\n.sentiment-icon {\n  width: 50px;\n  height: 50px;\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n"; });
define('text!lookup-form.html', ['module'], function(module) { module.exports = "<template><form><fieldset class=\"form-group\"><legend>Business Sentiment Lookup</legend><div class=\"form-group required\"><label class=\"control-label\">Business Type</label><select value.bind=\"typeId\" class=\"form-control\"><option></option><option repeat.for=\"option of bussinessTypes\" model.bind=\"option\">${option.name}</option></select></div><div class=\"form-group required\"><label class=\"control-label\">Country</label><select value.bind=\"countryId\" class=\"form-control\"><option></option><option repeat.for=\"option of countries\" model.bind=\"option\">${option.name}</option></select></div><div class=\"form-group required\"><label class=\"control-label\">Business Name</label><input value.bind=\"businessName\" class=\"form-control\"></div></fieldset><button click.trigger=\"performLookup()\" class=\"btn btn-primary\" disabled.bind=\"!canLookup\">Perform lookup</button></form></template>"; });
define('text!lookup-result.html', ['module'], function(module) { module.exports = "<template><h3>${lookupData.business.name} <small>${lookupData.business.country}</small></h3><div class=\"snapshot-report\"><div class=\"row\"><div class=\"col-md-6\"><h4>Lookup</h4><dl class=\"dl-horizontal\"><dt>Average sentiment</dt><dd>${lookupData.averageSentiment}</dd><dt>Snapshot count</dt><dd>${lookupData.snapshotCount}</dd></dl><img class=\"sentiment-icon\" src.bind=\"'images/' + lookupData.averageSentiment + '.png'\"></div><div class=\"col-md-6\"><h4>Snapshots</h4><dl repeat.for=\"snapshot of snapshots\" class=\"dl-horizontal\"><dt>Rank/relevance</dt><dd>${snapshot.rank}</dd><dt>Title</dt><dd>${snapshot.title}</dd><dt>Domain</dt><dd>${snapshot.lookupDomain}</dd><dt>URL</dt><dd><a href=\"${snapshot.url}\" target=\"_blank\">${snapshot.url}</a></dd><dt>Sentiment</dt><dd>${snapshot.sentiment}</dd></dl><ul class=\"pagination\"><li><a href=\"#\">1</a></li><li><a href=\"#\">2</a></li><li><a href=\"#\">3</a></li><li><a href=\"#\">4</a></li><li><a href=\"#\">5</a></li></ul></div></div></div></template>"; });
define('text!no-lookup.html', ['module'], function(module) { module.exports = "<template><div class=\"no-selection text-center\"><h2>${message}</h2></div></template>"; });
define('text!resources/no-results.html', ['module'], function(module) { module.exports = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>$Title$</title></head><body>$END$</body></html>"; });
//# sourceMappingURL=app-bundle.js.map