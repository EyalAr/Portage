/* jshint esnext:true */

import Channel from './Channel';
import Hub from './Hub';
import Subscription from './Subscription';

var defaultHub = new Hub();

defaultHub.Channel = Channel;
defaultHub.Hub = Hub;
defaultHub.Subscription = Subscription;

export default defaultHub;
