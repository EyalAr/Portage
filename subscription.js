(function(){
"use strict";

var _ = require('lodash');

function Subscription(cb, container){
    this._cb = cb;
    this._container = container;
    this._called = 0;
    this._limit = null;
}

Subscription.prototype.invoke = function(data){
    var r = this._cb.apply(null, data);
    this._called++;
    this._purge();
    return r;
};

Subscription.prototype._purge = function(){
    if (this._limit !== null && this._called >= this._limit)
        this.unsubscribe();
};

Subscription.prototype.limit = function(limit){
    if (!(_.isNumber(limit) && !_.isNaN(limit) && _.gte(limit, 0)))
        throw Error("limit must be a number greater or equal to 0");
    this._limit = this._called + limit;
    this._purge();
    return this;
};

Subscription.prototype.once = function(){
    return this.limit(1);
};

Subscription.prototype.unsubscribe = function(){
    var i = this._container.indexOf(this);
    if (i !== -1) this._container.splice(i, 1);
};

module.exports = Subscription;

})();
