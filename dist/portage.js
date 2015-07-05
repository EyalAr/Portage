(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.portage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint esnext:true */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fuzzytree = require('fuzzytree');

var _fuzzytree2 = _interopRequireDefault(_fuzzytree);

var _Subscription = require('./Subscription');

var _Subscription2 = _interopRequireDefault(_Subscription);

var Channel = (function () {
    function Channel() {
        _classCallCheck(this, Channel);

        this._tree = new _fuzzytree2['default']();
    }

    _createClass(Channel, [{
        key: 'subscribe',
        value: function subscribe(topic, cb) {
            if (!_lodash2['default'].isFunction(cb)) throw Error('callback must be a function');

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
        value: function publish(topic) {
            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            var nodes = this._tree.match(topic);
            nodes.reduce(function (cbs, node) {
                _push(cbs, node.getData());
                return cbs;
            }, []).forEach(function (s) {
                return s.invoke(data);
            });
        }
    }]);

    return Channel;
})();

function _push(target, elements) {
    var i;
    for (i = 0; i < elements.length; i++) target.push(elements[i]);
}

exports['default'] = Channel;
module.exports = exports['default'];

},{"./Subscription":3,"fuzzytree":undefined,"lodash":undefined}],2:[function(require,module,exports){
/* jshint esnext:true */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Channel = require('./Channel');

var _Channel2 = _interopRequireDefault(_Channel);

var Hub = (function () {
    function Hub() {
        _classCallCheck(this, Hub);

        this._channels = {};
    }

    _createClass(Hub, [{
        key: 'channel',
        value: function channel(name) {
            if (!_lodash2['default'].isString(name)) throw Error('channel name must be a string');
            return this._channels[name] = this._channels[name] || new _Channel2['default']();
        }
    }]);

    return Hub;
})();

exports['default'] = Hub;
module.exports = exports['default'];

},{"./Channel":1,"lodash":undefined}],3:[function(require,module,exports){
/* jshint esnext:true */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

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
        value: function invoke(data) {
            var r = this._cb.apply(null, data);
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
            if (!(_lodash2["default"].isNumber(n) && !_lodash2["default"].isNaN(n) && _lodash2["default"].gte(n, 0))) throw Error("limit must be a number greater or equal to 0");
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
            var i = this._container.indexOf(this);
            if (i !== -1) this._container.splice(i, 1);
        }
    }]);

    return Subscription;
})();

exports["default"] = Subscription;
module.exports = exports["default"];

},{"lodash":undefined}],4:[function(require,module,exports){
/* jshint esnext:true */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Channel = require('./Channel');

var _Channel2 = _interopRequireDefault(_Channel);

var _Hub = require('./Hub');

var _Hub2 = _interopRequireDefault(_Hub);

var _Subscription = require('./Subscription');

var _Subscription2 = _interopRequireDefault(_Subscription);

var defaultHub = new _Hub2['default']();

defaultHub.Channel = _Channel2['default'];
defaultHub.Hub = _Hub2['default'];
defaultHub.Subscription = _Subscription2['default'];

exports['default'] = defaultHub;
module.exports = exports['default'];

},{"./Channel":1,"./Hub":2,"./Subscription":3}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZXlhbGFyL0RvY3VtZW50cy9kZXYvcG9ydGFnZS9zcmMvQ2hhbm5lbC5qcyIsIi9Vc2Vycy9leWFsYXIvRG9jdW1lbnRzL2Rldi9wb3J0YWdlL3NyYy9IdWIuanMiLCIvVXNlcnMvZXlhbGFyL0RvY3VtZW50cy9kZXYvcG9ydGFnZS9zcmMvU3Vic2NyaXB0aW9uLmpzIiwiL1VzZXJzL2V5YWxhci9Eb2N1bWVudHMvZGV2L3BvcnRhZ2Uvc3JjL3BvcnRhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztzQkNFYyxRQUFROzs7O3lCQUNBLFdBQVc7Ozs7NEJBQ1IsZ0JBQWdCOzs7O0lBRW5DLE9BQU87QUFDRSxhQURULE9BQU8sR0FDSTs4QkFEWCxPQUFPOztBQUVMLFlBQUksQ0FBQyxLQUFLLEdBQUcsNEJBQWUsQ0FBQztLQUNoQzs7aUJBSEMsT0FBTzs7ZUFLQSxtQkFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDO0FBQ2hCLGdCQUFJLENBQUMsb0JBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0FBRWxFLGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxnQkFBSSxDQUFDLElBQUksRUFBRTtBQUNQLG9CQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsb0JBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDcEI7QUFDRCxnQkFBSSxDQUFDLEdBQUcsOEJBQWlCLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUM3QyxnQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFD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O0FBQy9CLGdCQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxtQkFBTyxJQUFJLENBQUM7U0FDZjs7O2VBRUcsZ0JBQUU7QUFDRixtQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hCOzs7ZUFFVSx1QkFBRTtBQUNULGdCQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxnQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlDOzs7V0FuQ0MsWUFBWTs7O3FCQXNDSCxZQUFZOzs7Ozs7Ozs7Ozs7Ozt1QkN4Q1AsV0FBVzs7OzttQkFDZixPQUFPOzs7OzRCQUNFLGdCQUFnQjs7OztBQUV6QyxJQUFJLFVBQVUsR0FBRyxzQkFBUyxDQUFDOztBQUUzQixVQUFVLENBQUMsT0FBTyx1QkFBVSxDQUFDO0FBQzdCLFVBQVUsQ0FBQyxHQUFHLG1CQUFNLENBQUM7QUFDckIsVUFBVSxDQUFDLFlBQVksNEJBQWUsQ0FBQzs7cUJBRXhCLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDp0cnVlICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgRnV6enlUcmVlIGZyb20gJ2Z1enp5dHJlZSc7XG5pbXBvcnQgU3Vic2NyaXB0aW9uIGZyb20gJy4vU3Vic2NyaXB0aW9uJztcblxuY2xhc3MgQ2hhbm5lbHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLl90cmVlID0gbmV3IEZ1enp5VHJlZSgpO1xuICAgIH1cblxuICAgIHN1YnNjcmliZSh0b3BpYywgY2Ipe1xuICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihjYikpIHRocm93IEVycm9yKFwiY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fdHJlZS5maW5kKHRvcGljKTtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICBub2RlID0gdGhpcy5fdHJlZS5pbnNlcnQodG9waWMpO1xuICAgICAgICAgICAgbm9kZS5zZXREYXRhKFtdKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcyA9IG5ldyBTdWJzY3JpcHRpb24oY2IsIG5vZGUuZ2V0RGF0YSgpKTtcbiAgICAgICAgbm9kZS5nZXREYXRhKCkucHVzaChzKTtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgcHVibGlzaCh0b3BpYywgLi4uZGF0YSl7XG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMuX3RyZWUubWF0Y2godG9waWMpO1xuICAgICAgICBub2Rlcy5yZWR1Y2UoKGNicywgbm9kZSkgPT4ge1xuICAgICAgICAgICAgX3B1c2goY2JzLCBub2RlLmdldERhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gY2JzO1xuICAgICAgICB9LCBbXSkuZm9yRWFjaChzID0+IHMuaW52b2tlKGRhdGEpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF9wdXNoKHRhcmdldCwgZWxlbWVudHMpe1xuICAgIHZhciBpO1xuICAgIGZvciAoaSA9IDAgOyBpIDwgZWxlbWVudHMubGVuZ3RoIDsgaSsrKSB0YXJnZXQucHVzaChlbGVtZW50c1tpXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5uZWw7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OnRydWUgKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbCc7XG5cbmNsYXNzIEh1YntcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLl9jaGFubmVscyA9IHt9O1xuICAgIH1cblxuICAgIGNoYW5uZWwobmFtZSl7XG4gICAgICAgIGlmICghXy5pc1N0cmluZyhuYW1lKSkgdGhyb3cgRXJyb3IoXCJjaGFubmVsIG5hbWUgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgICAgICAgcmV0dXJuICggdGhpcy5fY2hhbm5lbHNbbmFtZV0gPSB0aGlzLl9jaGFubmVsc1tuYW1lXSB8fCBuZXcgQ2hhbm5lbCgpICk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIdWI7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OnRydWUgKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuY2xhc3MgU3Vic2NyaXB0aW9ue1xuICAgIGNvbnN0cnVjdG9yKGNiLCBjb250YWluZXIpe1xuICAgICAgICB0aGlzLl9jYiA9IGNiO1xuICAgICAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICAgIHRoaXMuX2NhbGxlZCA9IDA7XG4gICAgICAgIHRoaXMuX2xpbWl0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbnZva2UoZGF0YSl7XG4gICAgICAgIHZhciByID0gdGhpcy5fY2IuYXBwbHkobnVsbCwgZGF0YSk7XG4gICAgICAgIHRoaXMuX2NhbGxlZCsrO1xuICAgICAgICB0aGlzLl9wdXJnZSgpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBfcHVyZ2UoKXtcbiAgICAgICAgaWYgKHRoaXMuX2xpbWl0ICE9PSBudWxsICYmIHRoaXMuX2NhbGxlZCA+PSB0aGlzLl9saW1pdClcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBsaW1pdChuKXtcbiAgICAgICAgaWYgKCEoXy5pc051bWJlcihuKSAmJiAhXy5pc05hTihuKSAmJiBfLmd0ZShuLCAwKSkpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcImxpbWl0IG11c3QgYmUgYSBudW1iZXIgZ3JlYXRlciBvciBlcXVhbCB0byAwXCIpO1xuICAgICAgICB0aGlzLl9saW1pdCA9IHRoaXMuX2NhbGxlZCArIG47XG4gICAgICAgIHRoaXMuX3B1cmdlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uY2UoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubGltaXQoMSk7XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmUoKXtcbiAgICAgICAgdmFyIGkgPSB0aGlzLl9jb250YWluZXIuaW5kZXhPZih0aGlzKTtcbiAgICAgICAgaWYgKGkgIT09IC0xKSB0aGlzLl9jb250YWluZXIuc3BsaWNlKGksIDEpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3Vic2NyaXB0aW9uO1xuIiwiLyoganNoaW50IGVzbmV4dDp0cnVlICovXG5cbmltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbCc7XG5pbXBvcnQgSHViIGZyb20gJy4vSHViJztcbmltcG9ydCBTdWJzY3JpcHRpb24gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuXG52YXIgZGVmYXVsdEh1YiA9IG5ldyBIdWIoKTtcblxuZGVmYXVsdEh1Yi5DaGFubmVsID0gQ2hhbm5lbDtcbmRlZmF1bHRIdWIuSHViID0gSHViO1xuZGVmYXVsdEh1Yi5TdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb247XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRIdWI7XG4iXX0=
