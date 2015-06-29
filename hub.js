(function(){
"use strict";

var Channel = require('./channel'),
    _ = require('lodash');

function Hub(){
    this._channels = {};
}

Hub.prototype.channel = function(name){
    if (!_.isString(name)) throw Error("channel name must be a string");
    return this._channels[name] = this._channels[name] || new Channel();
};

module.exports = Hub;
})();
