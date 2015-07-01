/* jshint esnext:true */

import _ from 'lodash';
import Channel from './Channel';

class Hub{
    constructor(){
        this._channels = {};
    }

    channel(name){
        if (!_.isString(name)) throw Error("channel name must be a string");
        return ( this._channels[name] = this._channels[name] || new Channel() );
    }
}

export default Hub;
