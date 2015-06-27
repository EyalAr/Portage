(function(){
"use strict";

var Channel = require('./channel');

function Hub(){
    this._channels = {};
}

Hub.prototype.channel = function(name){
    return this._channels[name] = this._channels[name] || new Channel();
};

module.exports = Hub;
})();
