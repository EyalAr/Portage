/* jshint esnext:true */

import {
    isNumber as _isNumber,
    isNaN as _isNaN,
    gte as _gte,
    indexOf as _indexOf
} from 'lodash';

class Subscription{
    constructor(cb, container){
        this._cb = cb;
        this._container = container;
        this._called = 0;
        this._limit = null;
    }

    invoke(data, meta){
        var r = this._cb(data, meta);
        this._called++;
        this._purge();
        return r;
    }

    _purge(){
        if (this._limit !== null && this._called >= this._limit)
            this.unsubscribe();
    }

    limit(n){
        if (!(_isNumber(n) && !_isNaN(n) && _gte(n, 0)))
            throw Error("limit must be a number greater or equal to 0");
        this._limit = this._called + n;
        this._purge();
        return this;
    }

    once(){
        return this.limit(1);
    }

    unsubscribe(){
        var i = _indexOf(this._container, this);
        if (i !== -1) this._container.splice(i, 1);
    }
}

export default Subscription;
