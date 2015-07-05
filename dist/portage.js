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

var _Subscription = require('./Subscription');

var _Subscription2 = _interopRequireDefault(_Subscription);

var Channel = (function () {
    function Channel() {
        _classCallCheck(this, Channel);

        this._separator = '.';
        this._wildcard = '*';
        this._greedyWildcard = '#';
        this._topicsDefs = {};
    }

    _createClass(Channel, [{
        key: 'subscribe',
        value: function subscribe(topic, cb) {
            if (_lodash2['default'].isString(topic)) topic = topic.split(this._separator);
            if (!_lodash2['default'].isArray(topic)) throw Error('topic must be an array or a string');
            if (!_lodash2['default'].isFunction(cb)) throw Error('callback must be a function');
            if (!topic.length) throw Error('topic must contain at least one section');
            if (!topic.every(_lodash2['default'].isString)) throw Error('all topic sections must be strings');

            var topicDef,
                i,
                classifier = topic[0];

            this._topicsDefs[classifier] = this._topicsDefs[classifier] || {
                direct: [],
                subtopics: {}
            };

            topicDef = this._topicsDefs[classifier];

            for (i = 1; i < topic.length; i++) {
                topicDef = topicDef.subtopics[topic[i]] = topicDef.subtopics[topic[i]] || {
                    direct: [],
                    subtopics: {}
                };
            }

            var s = new _Subscription2['default'](cb, topicDef.direct);
            topicDef.direct.push(s);
            return s;
        }
    }, {
        key: 'publish',
        value: function publish(topic) {
            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            if (_lodash2['default'].isString(topic)) topic = topic.split(this._separator);
            if (!_lodash2['default'].isArray(topic)) throw Error('topic must be an array or a string');
            if (!topic.length) throw Error('topic must contain at least one section');
            if (!topic.every(_lodash2['default'].isString)) throw Error('all topic sections must be strings');
            if (topic.some(isAnyWildcard.bind(this))) throw Error('topic section cannot be a wildcard');

            var subs = gatherSubscriptions.call(this, topic, {
                direct: [],
                subtopics: this._topicsDefs
            });

            subs.forEach(function (s) {
                return s.invoke(data);
            });
        }
    }]);

    return Channel;
})();

function isWildcard(s) {
    return s === this._wildcard;
}

function isGreedyWildcard(s) {
    return s === this._greedyWildcard;
}

function isAnyWildcard(s) {
    return isWildcard.call(this, s) || isGreedyWildcard.call(this, s);
}

function gatherSubscriptions(topic, topicsDefs) {
    var subtopic,
        classifier = topic[0],
        rest = topic.slice(1),
        subs = [],
        wildcard = this._wildcard,
        greedyWildcard = this._greedyWildcard;

    if (!rest.length) {
        for (subtopic in topicsDefs.subtopics) {
            if (topicsDefs.subtopics.hasOwnProperty(subtopic)) {
                if (subtopic === classifier || subtopic === wildcard || subtopic === greedyWildcard) {
                    _push(subs, topicsDefs.subtopics[subtopic].direct);
                }
            }
        }
    } else {
        for (subtopic in topicsDefs.subtopics) {
            if (topicsDefs.subtopics.hasOwnProperty(subtopic)) {
                if (subtopic === greedyWildcard) {
                    _push(subs, gatherDeepSubscriptions.call(this, rest, topicsDefs.subtopics[subtopic]));
                } else if (subtopic === classifier || subtopic === wildcard) {
                    _push(subs, gatherSubscriptions.call(this, rest, topicsDefs.subtopics[subtopic]));
                }
            }
        }
    }

    return subs;
}

function gatherDeepSubscriptions(rest, topicsDefs) {
    var subtopic,
        subs = [],
        wildcard = this._wildcard,
        greedyWildcard = this._greedyWildcard;

    _push(subs, topicsDefs.direct);

    for (subtopic in topicsDefs.subtopics) {
        if (topicsDefs.subtopics.hasOwnProperty(subtopic)) {
            var i = subtopic === greedyWildcard ? 0 : _lodash2['default'].lastIndexOf(rest, subtopic);
            if (i !== -1) {
                var def = {
                    direct: [],
                    subtopics: {}
                };
                def.subtopics[subtopic] = topicsDefs.subtopics[subtopic];
                _push(subs, gatherSubscriptions.call(this, rest.slice(i), def));
            }
        }
    }

    return subs;
}

function _push(target, elements) {
    var i;
    for (i = 0; i < elements.length; i++) target.push(elements[i]);
}

exports['default'] = Channel;
module.exports = exports['default'];

},{"./Subscription":3,"lodash":undefined}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZXlhbGFyL0RvY3VtZW50cy9kZXYvcG9ydGFnZS9zcmMvQ2hhbm5lbC5qcyIsIi9Vc2Vycy9leWFsYXIvRG9jdW1lbnRzL2Rldi9wb3J0YWdlL3NyYy9IdWIuanMiLCIvVXNlcnMvZXlhbGFyL0RvY3VtZW50cy9kZXYvcG9ydGFnZS9zcmMvU3Vic2NyaXB0aW9uLmpzIiwiL1VzZXJzL2V5YWxhci9Eb2N1bWVudHMvZGV2L3BvcnRhZ2Uvc3JjL3BvcnRhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztzQkNFYyxRQUFROzs7OzRCQUNHLGdCQUFnQjs7OztJQUVuQyxPQUFPO0FBQ0UsYUFEVCxPQUFPLEdBQ0k7OEJBRFgsT0FBTzs7QUFFTCxZQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztBQUN0QixZQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUNyQixZQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztBQUMzQixZQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztLQUN6Qjs7aUJBTkMsT0FBTzs7ZUFRQSxtQkFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDO0FBQ2hCLGdCQUFJLG9CQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsZ0JBQUksQ0FBQyxvQkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUN6RSxnQkFBSSxDQUFDLG9CQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2xFLGdCQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0s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LG1CQUFNLENBQUM7QUFDckIsVUFBVSxDQUFDLFlBQVksNEJBQWUsQ0FBQzs7cUJBRXhCLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDp0cnVlICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgU3Vic2NyaXB0aW9uIGZyb20gJy4vU3Vic2NyaXB0aW9uJztcblxuY2xhc3MgQ2hhbm5lbHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLl9zZXBhcmF0b3IgPSAnLic7XG4gICAgICAgIHRoaXMuX3dpbGRjYXJkID0gJyonO1xuICAgICAgICB0aGlzLl9ncmVlZHlXaWxkY2FyZCA9ICcjJztcbiAgICAgICAgdGhpcy5fdG9waWNzRGVmcyA9IHt9O1xuICAgIH1cblxuICAgIHN1YnNjcmliZSh0b3BpYywgY2Ipe1xuICAgICAgICBpZiAoXy5pc1N0cmluZyh0b3BpYykpIHRvcGljID0gdG9waWMuc3BsaXQodGhpcy5fc2VwYXJhdG9yKTtcbiAgICAgICAgaWYgKCFfLmlzQXJyYXkodG9waWMpKSB0aHJvdyBFcnJvcihcInRvcGljIG11c3QgYmUgYW4gYXJyYXkgb3IgYSBzdHJpbmdcIik7XG4gICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGNiKSkgdGhyb3cgRXJyb3IoXCJjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIGlmICghdG9waWMubGVuZ3RoKSB0aHJvdyBFcnJvcihcInRvcGljIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgc2VjdGlvblwiKTtcbiAgICAgICAgaWYgKCF0b3BpYy5ldmVyeShfLmlzU3RyaW5nKSkgdGhyb3cgRXJyb3IoXCJhbGwgdG9waWMgc2VjdGlvbnMgbXVzdCBiZSBzdHJpbmdzXCIpO1xuXG4gICAgICAgIHZhciB0b3BpY0RlZiwgaSxcbiAgICAgICAgICAgIGNsYXNzaWZpZXIgPSB0b3BpY1swXTtcblxuICAgICAgICB0aGlzLl90b3BpY3NEZWZzW2NsYXNzaWZpZXJdID0gdGhpcy5fdG9waWNzRGVmc1tjbGFzc2lmaWVyXSB8fCB7XG4gICAgICAgICAgICBkaXJlY3Q6IFtdLFxuICAgICAgICAgICAgc3VidG9waWNzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIHRvcGljRGVmID0gdGhpcy5fdG9waWNzRGVmc1tjbGFzc2lmaWVyXTtcblxuICAgICAgICBmb3IgKGkgPSAxIDsgaSA8IHRvcGljLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICB0b3BpY0RlZiA9XG4gICAgICAgICAgICB0b3BpY0RlZi5zdWJ0b3BpY3NbdG9waWNbaV1dID0gdG9waWNEZWYuc3VidG9waWNzW3RvcGljW2ldXSB8fCB7XG4gICAgICAgICAgICAgICAgZGlyZWN0OiBbXSxcbiAgICAgICAgICAgICAgICBzdWJ0b3BpY3M6IHt9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMgPSBuZXcgU3Vic2NyaXB0aW9uKGNiLCB0b3BpY0RlZi5kaXJlY3QpO1xuICAgICAgICB0b3BpY0RlZi5kaXJlY3QucHVzaChzKTtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgcHVibGlzaCh0b3BpYywgLi4uZGF0YSl7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKHRvcGljKSkgdG9waWMgPSB0b3BpYy5zcGxpdCh0aGlzLl9zZXBhcmF0b3IpO1xuICAgICAgICBpZiAoIV8uaXNBcnJheSh0b3BpYykpIHRocm93IEVycm9yKFwidG9waWMgbXVzdCBiZSBhbiBhcnJheSBvciBhIHN0cmluZ1wiKTtcbiAgICAgICAgaWYgKCF0b3BpYy5sZW5ndGgpIHRocm93IEVycm9yKFwidG9waWMgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBzZWN0aW9uXCIpO1xuICAgICAgICBpZiAoIXRvcGljLmV2ZXJ5KF8uaXNTdHJpbmcpKSB0aHJvdyBFcnJvcihcImFsbCB0b3BpYyBzZWN0aW9ucyBtdXN0IGJlIHN0cmluZ3NcIik7XG4gICAgICAgIGlmICh0b3BpYy5zb21lKGlzQW55V2lsZGNhcmQuYmluZCh0aGlzKSkpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcInRvcGljIHNlY3Rpb24gY2Fubm90IGJlIGEgd2lsZGNhcmRcIik7XG5cbiAgICAgICAgdmFyIHN1YnMgPSBnYXRoZXJTdWJzY3JpcHRpb25zLmNhbGwoXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICB0b3BpYyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdDogW10sXG4gICAgICAgICAgICAgICAgICAgIHN1YnRvcGljczogdGhpcy5fdG9waWNzRGVmc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgc3Vicy5mb3JFYWNoKHMgPT4gcy5pbnZva2UoZGF0YSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNXaWxkY2FyZChzKXtcbiAgICByZXR1cm4gcyA9PT0gdGhpcy5fd2lsZGNhcmQ7XG59XG5cbmZ1bmN0aW9uIGlzR3JlZWR5V2lsZGNhcmQocyl7XG4gICAgcmV0dXJuIHMgPT09IHRoaXMuX2dyZWVkeVdpbGRjYXJkO1xufVxuXG5mdW5jdGlvbiBpc0FueVdpbGRjYXJkKHMpe1xuICAgIHJldHVybiBpc1dpbGRjYXJkLmNhbGwodGhpcywgcykgfHwgaXNHcmVlZHlXaWxkY2FyZC5jYWxsKHRoaXMsIHMpO1xufVxuXG5mdW5jdGlvbiBnYXRoZXJTdWJzY3JpcHRpb25zKHRvcGljLCB0b3BpY3NEZWZzKXtcbiAgICB2YXIgc3VidG9waWMsXG4gICAgICAgIGNsYXNzaWZpZXIgPSB0b3BpY1swXSxcbiAgICAgICAgcmVzdCA9IHRvcGljLnNsaWNlKDEpLFxuICAgICAgICBzdWJzID0gW10sXG4gICAgICAgIHdpbGRjYXJkID0gdGhpcy5fd2lsZGNhcmQsXG4gICAgICAgIGdyZWVkeVdpbGRjYXJkID0gdGhpcy5fZ3JlZWR5V2lsZGNhcmQ7XG5cbiAgICBpZiAoIXJlc3QubGVuZ3RoKXtcbiAgICAgICAgZm9yIChzdWJ0b3BpYyBpbiB0b3BpY3NEZWZzLnN1YnRvcGljcyl7XG4gICAgICAgICAgICBpZiAodG9waWNzRGVmcy5zdWJ0b3BpY3MuaGFzT3duUHJvcGVydHkoc3VidG9waWMpKXtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN1YnRvcGljID09PSBjbGFzc2lmaWVyIHx8XG4gICAgICAgICAgICAgICAgICAgIHN1YnRvcGljID09PSB3aWxkY2FyZCB8fFxuICAgICAgICAgICAgICAgICAgICBzdWJ0b3BpYyA9PT0gZ3JlZWR5V2lsZGNhcmRcbiAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICBfcHVzaChzdWJzLCB0b3BpY3NEZWZzLnN1YnRvcGljc1tzdWJ0b3BpY10uZGlyZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHN1YnRvcGljIGluIHRvcGljc0RlZnMuc3VidG9waWNzKXtcbiAgICAgICAgICAgIGlmICh0b3BpY3NEZWZzLnN1YnRvcGljcy5oYXNPd25Qcm9wZXJ0eShzdWJ0b3BpYykpe1xuICAgICAgICAgICAgICAgIGlmIChzdWJ0b3BpYyA9PT0gZ3JlZWR5V2lsZGNhcmQpe1xuICAgICAgICAgICAgICAgICAgICBfcHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBnYXRoZXJEZWVwU3Vic2NyaXB0aW9ucy5jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BpY3NEZWZzLnN1YnRvcGljc1tzdWJ0b3BpY11cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1YnRvcGljID09PSBjbGFzc2lmaWVyIHx8IHN1YnRvcGljID09PSB3aWxkY2FyZCl7XG4gICAgICAgICAgICAgICAgICAgIF9wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VicyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhdGhlclN1YnNjcmlwdGlvbnMuY2FsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9waWNzRGVmcy5zdWJ0b3BpY3Nbc3VidG9waWNdXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnM7XG59XG5cbmZ1bmN0aW9uIGdhdGhlckRlZXBTdWJzY3JpcHRpb25zKHJlc3QsIHRvcGljc0RlZnMpe1xuICAgIHZhciBzdWJ0b3BpYyxcbiAgICAgICAgc3VicyA9IFtdLFxuICAgICAgICB3aWxkY2FyZCA9IHRoaXMuX3dpbGRjYXJkLFxuICAgICAgICBncmVlZHlXaWxkY2FyZCA9IHRoaXMuX2dyZWVkeVdpbGRjYXJkO1xuXG4gICAgX3B1c2goc3VicywgdG9waWNzRGVmcy5kaXJlY3QpO1xuXG4gICAgZm9yIChzdWJ0b3BpYyBpbiB0b3BpY3NEZWZzLnN1YnRvcGljcyl7XG4gICAgICAgIGlmICh0b3BpY3NEZWZzLnN1YnRvcGljcy5oYXNPd25Qcm9wZXJ0eShzdWJ0b3BpYykpe1xuICAgICAgICAgICAgdmFyIGkgPSBzdWJ0b3BpYyA9PT0gZ3JlZWR5V2lsZGNhcmQgPyAwIDogXy5sYXN0SW5kZXhPZihyZXN0LCBzdWJ0b3BpYyk7XG4gICAgICAgICAgICBpZiAoaSAhPT0gLTEpe1xuICAgICAgICAgICAgICAgIHZhciBkZWYgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdDogW10sXG4gICAgICAgICAgICAgICAgICAgIHN1YnRvcGljczoge31cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRlZi5zdWJ0b3BpY3Nbc3VidG9waWNdID0gdG9waWNzRGVmcy5zdWJ0b3BpY3Nbc3VidG9waWNdO1xuICAgICAgICAgICAgICAgIF9wdXNoKFxuICAgICAgICAgICAgICAgICAgICBzdWJzLFxuICAgICAgICAgICAgICAgICAgICBnYXRoZXJTdWJzY3JpcHRpb25zLmNhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdC5zbGljZShpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZlxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdWJzO1xufVxuXG5mdW5jdGlvbiBfcHVzaCh0YXJnZXQsIGVsZW1lbnRzKXtcbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSAwIDsgaSA8IGVsZW1lbnRzLmxlbmd0aCA7IGkrKykgdGFyZ2V0LnB1c2goZWxlbWVudHNbaV0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFubmVsO1xuIiwiLyoganNoaW50IGVzbmV4dDp0cnVlICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwnO1xuXG5jbGFzcyBIdWJ7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5fY2hhbm5lbHMgPSB7fTtcbiAgICB9XG5cbiAgICBjaGFubmVsKG5hbWUpe1xuICAgICAgICBpZiAoIV8uaXNTdHJpbmcobmFtZSkpIHRocm93IEVycm9yKFwiY2hhbm5lbCBuYW1lIG11c3QgYmUgYSBzdHJpbmdcIik7XG4gICAgICAgIHJldHVybiAoIHRoaXMuX2NoYW5uZWxzW25hbWVdID0gdGhpcy5fY2hhbm5lbHNbbmFtZV0gfHwgbmV3IENoYW5uZWwoKSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSHViO1xuIiwiLyoganNoaW50IGVzbmV4dDp0cnVlICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmNsYXNzIFN1YnNjcmlwdGlvbntcbiAgICBjb25zdHJ1Y3RvcihjYiwgY29udGFpbmVyKXtcbiAgICAgICAgdGhpcy5fY2IgPSBjYjtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICB0aGlzLl9jYWxsZWQgPSAwO1xuICAgICAgICB0aGlzLl9saW1pdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaW52b2tlKGRhdGEpe1xuICAgICAgICB2YXIgciA9IHRoaXMuX2NiLmFwcGx5KG51bGwsIGRhdGEpO1xuICAgICAgICB0aGlzLl9jYWxsZWQrKztcbiAgICAgICAgdGhpcy5fcHVyZ2UoKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgX3B1cmdlKCl7XG4gICAgICAgIGlmICh0aGlzLl9saW1pdCAhPT0gbnVsbCAmJiB0aGlzLl9jYWxsZWQgPj0gdGhpcy5fbGltaXQpXG4gICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgbGltaXQobil7XG4gICAgICAgIGlmICghKF8uaXNOdW1iZXIobikgJiYgIV8uaXNOYU4obikgJiYgXy5ndGUobiwgMCkpKVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJsaW1pdCBtdXN0IGJlIGEgbnVtYmVyIGdyZWF0ZXIgb3IgZXF1YWwgdG8gMFwiKTtcbiAgICAgICAgdGhpcy5fbGltaXQgPSB0aGlzLl9jYWxsZWQgKyBuO1xuICAgICAgICB0aGlzLl9wdXJnZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbmNlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbWl0KDEpO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlKCl7XG4gICAgICAgIHZhciBpID0gdGhpcy5fY29udGFpbmVyLmluZGV4T2YodGhpcyk7XG4gICAgICAgIGlmIChpICE9PSAtMSkgdGhpcy5fY29udGFpbmVyLnNwbGljZShpLCAxKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN1YnNjcmlwdGlvbjtcbiIsIi8qIGpzaGludCBlc25leHQ6dHJ1ZSAqL1xuXG5pbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwnO1xuaW1wb3J0IEh1YiBmcm9tICcuL0h1Yic7XG5pbXBvcnQgU3Vic2NyaXB0aW9uIGZyb20gJy4vU3Vic2NyaXB0aW9uJztcblxudmFyIGRlZmF1bHRIdWIgPSBuZXcgSHViKCk7XG5cbmRlZmF1bHRIdWIuQ2hhbm5lbCA9IENoYW5uZWw7XG5kZWZhdWx0SHViLkh1YiA9IEh1YjtcbmRlZmF1bHRIdWIuU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0SHViO1xuIl19
