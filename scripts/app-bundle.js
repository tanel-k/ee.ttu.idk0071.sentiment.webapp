define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Sentimental.ly';
      config.map([{
        route: '',
        name: 'lookup-form',
        moduleId: 'containers/lookup-form/lookup-form'
      }, {
        route: 'lookups/:lookupId',
        name: 'lookup-detail',
        moduleId: 'containers/lookup-detail/lookup-detail'
      }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		debug: true,
		testing: true,
		gatewayURL: 'http://localhost:8080/'
	};
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
define('lib/utils',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isEmpty = isEmpty;
  function isEmpty(val) {
    return !val || !val.trim();
  }
});
define('resources/index',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.configure = configure;
	function configure(config) {
		config.globalResources([]);
	}
});
define('containers/lookup-detail/lookup-detail',['exports', 'aurelia-framework', '../../gateways/data/data-api'], function (exports, _aureliaFramework, _dataApi) {
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

  var _dec, _class;

  var LookupResult = exports.LookupResult = (_dec = (0, _aureliaFramework.inject)(_dataApi.DataAPI), _dec(_class = function () {
    function LookupResult(api) {
      _classCallCheck(this, LookupResult);

      this.api = api;
    }

    LookupResult.prototype.activate = function activate(params) {
      var _this = this;

      this.api.getLookupData(params.lookupId).then(function (lookupData) {
        _this.lookupData = JSON.stringify(lookupData, null, ' ');
      });
    };

    return LookupResult;
  }()) || _class);
});
define('containers/lookup-form/lookup-form',['exports', 'aurelia-framework', '../../lib/utils', 'aurelia-router', 'blockUI', '../../gateways/data/data-api', 'jquery'], function (exports, _aureliaFramework, _utils, _aureliaRouter, _blockUI, _dataApi) {
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

  var LookupForm = exports.LookupForm = (_dec = (0, _aureliaFramework.inject)(_dataApi.DataAPI, _aureliaRouter.Router), _dec(_class = function () {
    function LookupForm(api, router) {
      _classCallCheck(this, LookupForm);

      this.api = api;
      this.router = router;
      this.entityName = '';
    }

    LookupForm.prototype.performLookup = function performLookup() {
      var _this = this;

      blockPage();

      this.api.performLookup({
        entityName: this.entityName,
        domainIds: []
      }).then(function (lookupResult) {
        releasePage();
        _this.router.navigate('lookups/' + lookupResult.id);
      });
    };

    _createClass(LookupForm, [{
      key: 'canLookup',
      get: function get() {
        return !(0, _utils.isEmpty)(this.entityName);
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
define('gateways/data/data-api',['exports', 'aurelia-framework', 'aurelia-fetch-client', '../../environment'], function (exports, _aureliaFramework, _aureliaFetchClient, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DataAPI = undefined;

  var _environment2 = _interopRequireDefault(_environment);

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

  var _dec, _class;

  var DataAPI = exports.DataAPI = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
    function DataAPI(httpClient) {
      _classCallCheck(this, DataAPI);

      this.httpClient = httpClient.configure(function (config) {
        return config.useStandardConfiguration().withBaseUrl(_environment2.default.gatewayURL);
      });
    }

    DataAPI.prototype.isRequesting = function isRequesting() {
      return this.httpClient.isRequesting;
    };

    DataAPI.prototype.getLookupData = function getLookupData(lookupId) {
      return this.httpClient.fetch('lookups/' + lookupId).then(function (response) {
        return response.json();
      });
    };

    DataAPI.prototype.performLookup = function performLookup(lookupData) {
      return this.httpClient.fetch('lookups', {
        method: 'POST',
        body: JSON.stringify(lookupData),
        headers: {
          'Content-type': 'application/json'
        } }).then(function (response) {
        return response.json();
      });
    };

    return DataAPI;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"./styles.css\"></require><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-user\"></i> <span>Sentimental.ly</span></a></div></nav><div class=\"container\"><router-view></router-view></div></template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\r\n\r\nsection {\r\n  margin: 0 20px;\r\n}\r\n\r\n.blockOverlay {\r\n\tz-index: 2000 !important;\r\n}\r\n\r\n.navbar-nav li.loader {\r\n    margin: 12px 24px 0 6px;\r\n}\r\n\r\n.panel {\r\n  margin: 20px;\r\n}\r\n\r\n.button-bar {\r\n  right: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  border-top: 1px solid #ddd;\r\n  background: white;\r\n}\r\n\r\n.button-bar > button {\r\n  float: right;\r\n  margin: 20px;\r\n}\r\n\r\n.form-group.required .control-label:after {\r\n  content:\"*\";\r\n  color:red;\r\n}\r\n\r\n.sentiment-icon {\r\n  width: 50px;\r\n  height: 50px;\r\n  display: block;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n"; });
define('text!containers/lookup-detail/lookup-detail.html', ['module'], function(module) { module.exports = "<template><div class=\"snapshot-report\"><div class=\"row\"><div class=\"col-md-6\"><h4>Lookup data dump</h4></div><div class=\"col-md-6\">${lookupData}</div></div></div></template>"; });
define('text!containers/lookup-form/lookup-form.html', ['module'], function(module) { module.exports = "<template><form><fieldset class=\"form-group\"><legend>Sentiment Lookup</legend><div class=\"form-group\"><label class=\"control-label\">Keyword</label><input value.bind=\"entityName\" class=\"form-control\"> <small></small></div></fieldset><button click.trigger=\"performLookup()\" class=\"btn btn-primary\" disabled.bind=\"!canLookup\">Perform lookup</button></form></template>"; });
//# sourceMappingURL=app-bundle.js.map