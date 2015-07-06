(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("fuzzytree"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "fuzzytree"], factory);
	else if(typeof exports === 'object')
		exports["portage"] = factory(require("lodash"), require("fuzzytree"));
	else
		root["portage"] = factory(root["_"], root["FuzzyTree"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint esnext:true */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Channel = __webpack_require__(1);
	
	var _Channel2 = _interopRequireDefault(_Channel);
	
	var _Hub = __webpack_require__(5);
	
	var _Hub2 = _interopRequireDefault(_Hub);
	
	var _Subscription = __webpack_require__(4);
	
	var _Subscription2 = _interopRequireDefault(_Subscription);
	
	var defaultHub = new _Hub2['default']();
	
	defaultHub.Channel = _Channel2['default'];
	defaultHub.Hub = _Hub2['default'];
	defaultHub.Subscription = _Subscription2['default'];
	
	exports['default'] = defaultHub;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint esnext:true */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _lodash = __webpack_require__(2);
	
	var _fuzzytree = __webpack_require__(3);
	
	var _fuzzytree2 = _interopRequireDefault(_fuzzytree);
	
	var _Subscription = __webpack_require__(4);
	
	var _Subscription2 = _interopRequireDefault(_Subscription);
	
	var Channel = (function () {
	    function Channel() {
	        _classCallCheck(this, Channel);
	
	        this._tree = new _fuzzytree2['default']();
	    }
	
	    _createClass(Channel, [{
	        key: 'subscribe',
	        value: function subscribe(topic, cb) {
	            if (!(0, _lodash.isFunction)(cb)) throw Error('callback must be a function');
	
	            var node = this._tree.find(topic);
	            if (!node) {
	                node = this._tree.insert(topic);
	                node.setData([]);
	            }
	            var s = new _Subscription2['default'](cb, node.getData());
	            node.getData().push(s);
	            return s;
	        }
	    }, {
	        key: 'publish',
	        value: function publish(topic, data) {
	            var nodes = this._tree.match(topic),
	                subs = (0, _lodash.reduce)(nodes, function (subs, node) {
	                (0, _lodash.forEach)(node.getData(), function (s) {
	                    return subs.push(s);
	                });
	                return subs;
	            }, []);
	            (0, _lodash.forEach)(subs, function (s) {
	                return s.invoke(data, {
	                    topic: topic,
	                    called: s._called,
	                    limit: s._limit,
	                    last: s._limit !== null && s._called === s._limit - 1
	                });
	            });
	        }
	    }]);
	
	    return Channel;
	})();
	
	exports['default'] = Channel;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint esnext:true */
	
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _lodash = __webpack_require__(2);
	
	var Subscription = (function () {
	    function Subscription(cb, container) {
	        _classCallCheck(this, Subscription);
	
	        this._cb = cb;
	        this._container = container;
	        this._called = 0;
	        this._limit = null;
	    }
	
	    _createClass(Subscription, [{
	        key: "invoke",
	        value: function invoke(data, meta) {
	            var r = this._cb(data, meta);
	            this._called++;
	            this._purge();
	            return r;
	        }
	    }, {
	        key: "_purge",
	        value: function _purge() {
	            if (this._limit !== null && this._called >= this._limit) this.unsubscribe();
	        }
	    }, {
	        key: "limit",
	        value: function limit(n) {
	            if (!((0, _lodash.isNumber)(n) && !(0, _lodash.isNaN)(n) && (0, _lodash.gte)(n, 0))) throw Error("limit must be a number greater or equal to 0");
	            this._limit = this._called + n;
	            this._purge();
	            return this;
	        }
	    }, {
	        key: "once",
	        value: function once() {
	            return this.limit(1);
	        }
	    }, {
	        key: "unsubscribe",
	        value: function unsubscribe() {
	            var i = (0, _lodash.indexOf)(this._container, this);
	            if (i !== -1) this._container.splice(i, 1);
	        }
	    }]);
	
	    return Subscription;
	})();
	
	exports["default"] = Subscription;
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint esnext:true */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _lodash = __webpack_require__(2);
	
	var _Channel = __webpack_require__(1);
	
	var _Channel2 = _interopRequireDefault(_Channel);
	
	var Hub = (function () {
	    function Hub() {
	        _classCallCheck(this, Hub);
	
	        this._channels = {};
	    }
	
	    _createClass(Hub, [{
	        key: 'channel',
	        value: function channel(name) {
	            if (!(0, _lodash.isString)(name)) throw Error('channel name must be a string');
	            return this._channels[name] = this._channels[name] || new _Channel2['default']();
	        }
	    }]);
	
	    return Hub;
	})();
	
	exports['default'] = Hub;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=portage.js.map