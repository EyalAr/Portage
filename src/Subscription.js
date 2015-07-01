/* jshint esnext:true */

import _ from 'lodash';

class Subscription{
    constructor(cb, container){
        this._cb = cb;
        this._container = container;
        this._called = 0;
        this._limit = null;
    }

    invoke(data){
        var r = this._cb.apply(null, data);
        this._called++;
        this._purge();
        return r;
    }

    _purge(){
        if (this._limit !== null && this._called >= this._limit)
            this.unsubscribe();
    }

    limit(n){
        if (!(_.isNumber(n) && !_.isNaN(n) && _.gte(n, 0)))
            throw Error("limit must be a number greater or equal to 0");
        this._limit = this._called + n;
        this._purge();
        return this;
    }

    once(){
        return this.limit(1);
    }

    unsubscribe(){
        var i = this._container.indexOf(this);
        if (i !== -1) this._container.splice(i, 1);
    }
}

export default Subscription;
