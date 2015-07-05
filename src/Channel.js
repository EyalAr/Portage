/* jshint esnext:true */

import _ from 'lodash';
import FuzzyTree from 'fuzzytree';
import Subscription from './Subscription';

class Channel{
    constructor(){
        this._tree = new FuzzyTree();
    }

    subscribe(topic, cb){
        if (!_.isFunction(cb)) throw Error("callback must be a function");

        var node = this._tree.find(topic);
        if (!node) {
            node = this._tree.insert(topic);
            node.setData([]);
        }
        var s = new Subscription(cb, node.getData());
        node.getData().push(s);
        return s;
    }

    publish(topic, ...data){
        var nodes = this._tree.match(topic);
        nodes.reduce((cbs, node) => {
            _push(cbs, node.getData());
            return cbs;
        }, []).forEach(s => s.invoke(data));
    }
}

function _push(target, elements){
    var i;
    for (i = 0 ; i < elements.length ; i++) target.push(elements[i]);
}

export default Channel;
