/* jshint esnext:true */

import {
    isFunction as _isFunction,
    forEach as _forEach,
    reduce as _reduce
} from 'lodash';
import FuzzyTree from 'fuzzytree';
import Subscription from './Subscription';

class Channel{
    constructor(){
        this._tree = new FuzzyTree();
        this._strategy = defaultStrategy;
    }

    subscribe(topic, cb){
        if (!_isFunction(cb)) throw Error("callback must be a function");

        var node = this._tree.find(topic);
        if (!node) {
            node = this._tree.insert(topic);
            node.setData([]);
        }
        var s = new Subscription(cb, node.getData());
        node.getData().push(s);
        return s;
    }

    publish(topic, data){
        var nodes = this._tree.match(topic),
            subs = _reduce(nodes, (subs, node) => {
                _forEach(node.getData(), s => subs.push(s));
                return subs;
            }, []);
        return this._strategy(subs, data, topic);
    }
}

function defaultStrategy(subs, data, topic){
    _forEach(subs, s => s.invoke(data, {
        topic: topic,
        called: s._called,
        limit: s._limit,
        last: s._limit !== null && s._called === s._limit - 1
    }));
}

export default Channel;
