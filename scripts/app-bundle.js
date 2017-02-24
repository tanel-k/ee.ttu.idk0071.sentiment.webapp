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
					return { name: x.name, value: x.id };
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
				countryCode: this.countryId,
				businessTypeId: this.typeId,
				businessName: this.businessName
			}).then(function (lookupResult) {
				_this2.router.navigate("lookups/" + lookupResult.id);
			});
		};

		_createClass(LookupForm, [{
			key: 'canLookup',
			get: function get() {
				return this.typeId && this.countryId && !(0, _utils.isEmpty)(this.businessName) && !this.api.isRequesting();
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
        _this.snapshots = snapshotsResult;
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
define('web-api',['exports', 'aurelia-fetch-client'], function (exports, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.WebAPI = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var WebAPI = exports.WebAPI = function () {
    function WebAPI() {
      _classCallCheck(this, WebAPI);

      this.httpClient = new _aureliaFetchClient.HttpClient();
    }

    WebAPI.prototype.isRequesting = function isRequesting() {
      return this.httpClient.isRequesting;
    };

    WebAPI.prototype.getCountries = function getCountries() {
      return this.httpClient.fetch('http://localhost:8080/classifiers/countries').then(function (response) {
        return response.json();
      });
    };

    WebAPI.prototype.getBusinessTypes = function getBusinessTypes() {
      return this.httpClient.fetch('http://localhost:8080/classifiers/business-types').then(function (response) {
        return response.json();
      });
    };

    WebAPI.prototype.getLookupSnapshots = function getLookupSnapshots(lookupId) {
      return this.httpClient.fetch('http://localhost:8080/lookups/' + lookupId + '/snapshots').then(function (response) {
        return response.json();
      });
    };

    WebAPI.prototype.getLookupData = function getLookupData(lookupId) {
      return this.httpClient.fetch('http://localhost:8080/lookups/' + lookupId).then(function (response) {
        return response.json();
      });
    };

    WebAPI.prototype.performLookup = function performLookup(business) {
      return this.httpClient.fetch('http://localhost:8080/lookups', {
        method: 'POST',
        body: JSON.stringify(business),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(function (response) {
        return response.json();
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
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"./styles.css\"></require><require from=\"./lookup-form\"></require><require from=\"./lookup-result\"></require><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-user\"></i> <span>Sentimental.ly</span></a></div></nav><loading-indicator loading.bind=\"router.isNavigating || api.isRequesting()\"></loading-indicator><div class=\"container\"><div class=\"row\"><lookup-form class=\"col-md-4\"></lookup-form><router-view class=\"col-md-8\"></router-view></div></div></template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\r\n\r\nsection {\r\n  margin: 0 20px;\r\n}\r\n\r\n.navbar-nav li.loader {\r\n    margin: 12px 24px 0 6px;\r\n}\r\n\r\n.panel {\r\n  margin: 20px;\r\n}\r\n\r\n.button-bar {\r\n  right: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  border-top: 1px solid #ddd;\r\n  background: white;\r\n}\r\n\r\n.button-bar > button {\r\n  float: right;\r\n  margin: 20px;\r\n}\r\n\r\n.form-group.required .control-label:after {\r\n  content:\"*\";\r\n  color:red;\r\n}\r\n\r\n.sentiment-icon {\r\n  width: 50px;\r\n  height: 50px;\r\n  display: block;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n"; });
define('text!lookup-form.html', ['module'], function(module) { module.exports = "<template><form><fieldset class=\"form-group\"><legend>Business Sentiment Lookup</legend><div class=\"form-group required\"><label class=\"control-label\">Business Type</label><select value.bind=\"typeId\" class=\"form-control\"><option></option><option repeat.for=\"option of bussinessTypes\" model.bind=\"option.value\">${option.name}</option></select></div><div class=\"form-group required\"><label class=\"control-label\">Country</label><select value.bind=\"countryId\" class=\"form-control\"><option></option><option repeat.for=\"option of countries\" model.bind=\"option.value\">${option.name}</option></select></div><div class=\"form-group required\"><label class=\"control-label\">Business Name</label><input value.bind=\"businessName\" class=\"form-control\"></div></fieldset><button click.trigger=\"performLookup()\" class=\"btn btn-primary\" disabled.bind=\"!canLookup\">Perform lookup</button></form></template>"; });
define('text!lookup-result.html', ['module'], function(module) { module.exports = "<template><h3>${lookupData.business.businessName} <small>${lookupData.business.country.name}</small></h3><div class=\"snapshot-report\"><div class=\"row\"><div class=\"col-md-6\"><h4>Lookup</h4><dl class=\"dl-horizontal\"><dt>Average sentiment</dt><dd>${lookupData.sentimentType.name}</dd><dt>Snapshot count</dt><dd>${lookupData.snapshotCount}</dd></dl><img class=\"sentiment-icon\" src.bind=\"'images/' + lookupData.sentimentType.name + '.png'\"></div><div class=\"col-md-6\"><h4>Snapshots</h4><dl repeat.for=\"snapshot of snapshots\" class=\"dl-horizontal\"><dt>Rank/relevance</dt><dd>${snapshot.rank}</dd><dt>Title</dt><dd>${snapshot.title}</dd><dt>Domain</dt><dd>${snapshot.lookupDomain}</dd><dt>URL</dt><dd><a href=\"${snapshot.url}\" target=\"_blank\">${snapshot.url}</a></dd><dt>Sentiment</dt><dd>${snapshot.sentimentType.name}</dd></dl><ul class=\"pagination\"><li><a href=\"#\">1</a></li><li><a href=\"#\">2</a></li><li><a href=\"#\">3</a></li><li><a href=\"#\">4</a></li><li><a href=\"#\">5</a></li></ul></div></div></div></template>"; });
define('text!no-lookup.html', ['module'], function(module) { module.exports = "<template><div class=\"no-selection text-center\"><h2>${message}</h2></div></template>"; });
//# sourceMappingURL=app-bundle.js.map