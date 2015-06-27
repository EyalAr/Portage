var Hub = require('../hub'),
    util = require('util'),
    h = new Hub();

h.channel('chat').subscribe('chat.new.remote', function(data){
    console.log(1, data);
});

h.channel('chat').subscribe('chat.*.remote', function(data){
    console.log(2, data);
});

h.channel('video').subscribe('feed.*.remote', function(data){
    console.log(3, data);
});

h.channel('chat').publish('chat.new.remote', "hello");
h.channel('chta').publish('chat.new.remote', "ERROR");
h.channel('video').publish('feed.new.remote', "hello");

console.log(util.inspect(h, false, null));
