define('app',['exports', 'aurelia-framework', './web-api'], function (exports, _aureliaFramework, _webApi) {
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

	var _dec, _class;

	var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_webApi.WebAPI), _dec(_class = function () {
		function App(api) {
			_classCallCheck(this, App);

			this.api = api;
		}

		App.prototype.configureRouter = function configureRouter(config, router) {
			config.title = 'Sentimental.ly';
			config.map([{
				route: '',
				moduleId: 'no-lookup',
				title: 'Lookups'
			}, {
				route: 'lookups/:lookupId',
				moduleId: 'lookup-result',
				name: 'lookups'
			}]);

			this.router = router;
		};

		return App;
	}()) || _class);
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
define('lookup-form',['exports', 'aurelia-framework', './web-api', './utils', 'aurelia-router', 'aurelia-event-aggregator', './messages', 'blockUI', 'jquery'], function (exports, _aureliaFramework, _webApi, _utils, _aureliaRouter, _aureliaEventAggregator, _messages, _blockUI) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.LookupForm = undefined;

	var _blockUI2 = _interopRequireDefault(_blockUI);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

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

	var _dec, _class;

	var LookupForm = exports.LookupForm = (_dec = (0, _aureliaFramework.inject)(_webApi.WebAPI, _aureliaRouter.Router, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
		function LookupForm(api, router, ea) {
			_classCallCheck(this, LookupForm);

			this.api = api;
			this.router = router;
			this.ea = ea;
		}

		LookupForm.prototype.created = function created() {
			var _this = this;

			this.api.getBusinessTypes().then(function (types) {
				_this.types = types.map(function (x) {
					return { name: x.name, value: x.id };
				});
				_this.types.unshift({});
			});

			this.api.getCountries().then(function (countries) {
				_this.countries = countries.map(function (x) {
					return { name: x.name, value: x.code };
				});
				_this.countries.unshift({});
			});
		};

		LookupForm.prototype.performLookup = function performLookup() {
			var _this2 = this;

			this.ea.publish(new _messages.LookupStarted());
			blockPage();

			this.api.performLookup({
				countryCode: this.countryId,
				businessTypeId: this.typeId,
				businessName: this.businessName
			}).then(function (lookupResult) {
				releasePage();
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
	}()) || _class);


	function blockPage() {
		$.blockUI({ message: null });
	}

	function releasePage() {
		$.unblockUI();
	}
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
define('web-api',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
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

	var _dec, _class;

	var WebAPI = exports.WebAPI = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
		function WebAPI(httpClient) {
			_classCallCheck(this, WebAPI);

			this.httpClient = httpClient.configure(function (config) {
				return config.useStandardConfiguration().withBaseUrl('http://localhost:8080/');
			});
		}

		WebAPI.prototype.isRequesting = function isRequesting() {
			return this.httpClient.isRequesting;
		};

		WebAPI.prototype.getCountries = function getCountries() {
			return this.httpClient.fetch('classifiers/countries').then(function (response) {
				return response.json();
			});
		};

		WebAPI.prototype.getBusinessTypes = function getBusinessTypes() {
			return this.httpClient.fetch('classifiers/business-types').then(function (response) {
				return response.json();
			});
		};

		WebAPI.prototype.getLookupSnapshots = function getLookupSnapshots(lookupId) {
			return this.httpClient.fetch('lookups/' + lookupId + '/snapshots').then(function (response) {
				return response.json();
			});
		};

		WebAPI.prototype.getLookupData = function getLookupData(lookupId) {
			return this.httpClient.fetch('lookups/' + lookupId).then(function (response) {
				return response.json();
			});
		};

		WebAPI.prototype.performLookup = function performLookup(business) {
			return this.httpClient.fetch('lookups', {
				method: 'POST',
				body: JSON.stringify(business),
				headers: {
					'Content-type': 'application/json'
				} }).then(function (response) {
				return response.json();
			});
		};

		return WebAPI;
	}()) || _class);
});
define('resources/index',['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.configure = configure;
	function configure(config) {
		config.globalResources(['./elements/loading-indicator', './elements/enhanced-select']);
	}
});
define('resources/elements/enhanced-select',['exports', 'aurelia-framework', 'select2', 'jquery'], function (exports, _aureliaFramework, _select) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.EnhancedSelect = undefined;

	var _select2 = _interopRequireDefault(_select);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _initDefineProp(target, property, descriptor, context) {
		if (!descriptor) return;
		Object.defineProperty(target, property, {
			enumerable: descriptor.enumerable,
			configurable: descriptor.configurable,
			writable: descriptor.writable,
			value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
		});
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
		var desc = {};
		Object['ke' + 'ys'](descriptor).forEach(function (key) {
			desc[key] = descriptor[key];
		});
		desc.enumerable = !!desc.enumerable;
		desc.configurable = !!desc.configurable;

		if ('value' in desc || desc.initializer) {
			desc.writable = true;
		}

		desc = decorators.slice().reverse().reduce(function (desc, decorator) {
			return decorator(target, property, desc) || desc;
		}, desc);

		if (context && desc.initializer !== void 0) {
			desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
			desc.initializer = undefined;
		}

		if (desc.initializer === void 0) {
			Object['define' + 'Property'](target, property, desc);
			desc = null;
		}

		return desc;
	}

	function _initializerWarningHelper(descriptor, context) {
		throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
	}

	var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

	var EnhancedSelect = exports.EnhancedSelect = (_dec = (0, _aureliaFramework.inject)(Element), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.oneWay }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.oneWay }), _dec4 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = function () {
		function EnhancedSelect(element) {
			_classCallCheck(this, EnhancedSelect);

			_initDefineProp(this, 'guid', _descriptor, this);

			_initDefineProp(this, 'values', _descriptor2, this);

			_initDefineProp(this, 'value', _descriptor3, this);

			this.element = element;
		}

		EnhancedSelect.prototype.attached = function attached() {
			var _this = this;

			this.selector = $(this.element).find('select').select2().on('select2:select', function (event) {
				_this.value = $(_this.element).find('select').select2('val');
			});
		};

		EnhancedSelect.prototype.detached = function detached() {
			this.selector.select2('destroy');
		};

		return EnhancedSelect;
	}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'guid', [_dec2], {
		enumerable: true,
		initializer: function initializer() {
			return '';
		}
	}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'values', [_dec3], {
		enumerable: true,
		initializer: null
	}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec4], {
		enumerable: true,
		initializer: null
	})), _class2)) || _class);
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
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"select2/css/select2.css\"></require><require from=\"./styles.css\"></require><require from=\"./lookup-form\"></require><require from=\"./lookup-result\"></require><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-user\"></i> <span>Sentimental.ly</span></a></div></nav><loading-indicator loading.bind=\"router.isNavigating || api.isRequesting()\"></loading-indicator><div class=\"container\"><div class=\"row\"><lookup-form class=\"col-md-4\"></lookup-form><router-view class=\"col-md-8\"></router-view></div></div></template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\r\n\r\nsection {\r\n  margin: 0 20px;\r\n}\r\n\r\n.blockOverlay {\r\n\tz-index: 2000 !important;\r\n}\r\n\r\n.navbar-nav li.loader {\r\n    margin: 12px 24px 0 6px;\r\n}\r\n\r\n.panel {\r\n  margin: 20px;\r\n}\r\n\r\n.button-bar {\r\n  right: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  border-top: 1px solid #ddd;\r\n  background: white;\r\n}\r\n\r\n.button-bar > button {\r\n  float: right;\r\n  margin: 20px;\r\n}\r\n\r\n.form-group.required .control-label:after {\r\n  content:\"*\";\r\n  color:red;\r\n}\r\n\r\n.sentiment-icon {\r\n  width: 50px;\r\n  height: 50px;\r\n  display: block;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n"; });
define('text!lookup-form.html', ['module'], function(module) { module.exports = "<template><form><fieldset class=\"form-group\"><legend>Business Sentiment Lookup</legend><div class=\"form-group required\"><label class=\"control-label\">Business Type</label><enhanced-select guid=\"business-type-select\" value.bind=\"typeId\" values.bind=\"types\"></enhanced-select></div><div class=\"form-group required\"><label class=\"control-label\">Country</label><enhanced-select guid=\"country-select\" value.bind=\"countryId\" values.bind=\"countries\"></enhanced-select></div><div class=\"form-group required\"><label class=\"control-label\">Business Name</label><input value.bind=\"businessName\" class=\"form-control\"></div></fieldset><button click.trigger=\"performLookup()\" class=\"btn btn-primary\" disabled.bind=\"!canLookup\">Perform lookup</button></form></template>"; });
define('text!lookup-result.html', ['module'], function(module) { module.exports = "<template><h3>${lookupData.business.businessName} <small>${lookupData.business.country.name}</small></h3><div class=\"snapshot-report\"><div class=\"row\"><div class=\"col-md-6\"><h4>Lookup</h4><dl class=\"dl-horizontal\"><dt>Sentiment estimate</dt><dd>${lookupData.sentimentType.name}</dd></dl><img class=\"sentiment-icon\" src.bind=\"'images/' + lookupData.sentimentType.name + '.png'\"></div><div class=\"col-md-6\"><h4>Snapshots</h4><dl repeat.for=\"snapshot of snapshots\" class=\"dl-horizontal\"><dt>Rank/relevance</dt><dd>${snapshot.rank}</dd><dt>Title</dt><dd>${snapshot.title}</dd><dt>Domain</dt><dd>${snapshot.sentimentLookupDomain.name}</dd><dt>URL</dt><dd><a href=\"${snapshot.url}\" target=\"_blank\">${snapshot.url}</a></dd><dt>Sentiment</dt><dd>${snapshot.sentimentType.name}</dd><dt>Trustlevel</dt><dd>${snapshot.trustLevel}</dd></dl></div></div></div></template>"; });
define('text!no-lookup.html', ['module'], function(module) { module.exports = "<template><div class=\"no-selection text-center\"><h2>${message}</h2></div></template>"; });
define('text!resources/elements/enhanced-select.html', ['module'], function(module) { module.exports = "<template><select id=\"${guid}\" class=\"form-control\" value.bind=\"value\"><option if.bind=\"withEmpty\"></option><option repeat.for=\"val of values\" value=\"${val.value}\">${val.name}</option></select></template>"; });
//# sourceMappingURL=app-bundle.js.map