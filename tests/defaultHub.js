var portage = require('../'),
    util = require('util');

portage.channel('chat').subscribe('chat.new.remote', function(data){
    console.log(1, data);
});

portage.channel('chat').subscribe('chat.*.remote', function(data){
    console.log(2, data);
});

portage.channel('video').subscribe('feed.*.remote', function(data){
    console.log(3, data);
});

portage.channel('chat').publish('chat.new.remote', "hello");
portage.channel('chta').publish('chat.new.remote', "ERROR");
portage.channel('video').publish('feed.new.remote', "hello");

console.log(util.inspect(portage, false, null));
