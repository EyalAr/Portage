(function(){
"use strict";

var Channel = require('./channel'),
    globalHub = new Hub();

function Hub(){
    this._channels = {};
}

Hub.prototype.channel = function(name){
    return this._channels[name] = this._channels[name] || new Channel();
};

Hub.channel = globalHub.channel.bind(globalHub);

module.exports = Hub;
})();
