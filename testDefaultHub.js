var Hub = require('./hub'),
    util = require('util');

Hub.channel('chat').subscribe('chat.new.remote', function(data){
    console.log(1, data);
});

Hub.channel('chat').subscribe('chat.*.remote', function(data){
    console.log(2, data);
});

Hub.channel('video').subscribe('feed.*.remote', function(data){
    console.log(3, data);
});

Hub.channel('chat').publish('chat.new.remote', "hello");
Hub.channel('chta').publish('chat.new.remote', "ERROR");
Hub.channel('video').publish('feed.new.remote', "hello");

console.log(util.inspect(Hub, false, null));
