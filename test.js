var Portage = require('./portage');
var util = require('util');
var p = new Portage();
p.subscribe('chat.new.remote', function(data){
    console.log(1, 'a', data);
});
p.subscribe('chat.new.remote', function(data){
    console.log(1, 'b', data);
});
p.subscribe('*.new.remote', function(data){
    console.log(2, data);
});
p.subscribe('chat.*.remote', function(data){
    console.log(3, data);
});
p.subscribe('chat.new.*', function(data){
    console.log(4, data);
});
p.subscribe('*.*.remote', function(data){
    console.log(5, data);
});
p.subscribe('*.new.*', function(data){
    console.log(6, data);
});
p.subscribe('chat.*.*', function(data){
    console.log(7, data);
});
p.subscribe('*.*.*', function(data){
    console.log(8, data);
});
p.subscribe('*', function(data){
    console.log("ERROR");
});
p.subscribe('*.*', function(data){
    console.log("ERROR");
});
p.subscribe('chat.*', function(data){
    console.log("ERROR");
});
p.publish('chat.new.remote', "hello");
console.log(util.inspect(p, false, null));
p.publish('chat.*.remote', "ERROR");
