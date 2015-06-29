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

Subscription.prototype.unsubscribe = function(){
    var i = this.container.indexOf(this);
    if (i !== -1) this.container.splice(i, 1);
};

module.exports = Subscription;

})();
