(function(){
"use strict";

function Subscription(cb, container){
    this.cb = cb;
    this.container = container;
    this.called = 0;
}

Subscription.prototype.invoke = function(data){
    this.cb.apply(null, data);
    this.called++;
};

module.exports = Subscription;

})();
