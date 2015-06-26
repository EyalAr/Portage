var Channel = require('./channel'),
    util = require('util'),
    c = new Channel();

c.subscribe('chat.new.remote', function(data){
    console.log(1, 'a', data);
});
c.subscribe('chat.new.remote', function(data){
    console.log(1, 'b', data);
});
c.subscribe('*.new.remote', function(data){
    console.log(2, data);
});
c.subscribe('chat.*.remote', function(data){
    console.log(3, data);
});
c.subscribe('chat.new.*', function(data){
    console.log(4, data);
});
c.subscribe('*.*.remote', function(data){
    console.log(5, data);
});
c.subscribe('*.new.*', function(data){
    console.log(6, data);
});
c.subscribe('chat.*.*', function(data){
    console.log(7, data);
});
c.subscribe('*.*.*', function(data){
    console.log(8, data);
});
c.subscribe('chat.new.**', function(data){
    console.log(9, data);
});
c.subscribe('chat.**', function(data){
    console.log(10, data);
});
c.subscribe('**', function(data){
    console.log(11, data);
});
c.subscribe('*', function(data){
    console.log("ERROR");
});
c.subscribe('*.*', function(data){
    console.log("ERROR");
});
c.subscribe('chat.*', function(data){
    console.log("ERROR");
});
c.publish('chat.new.remote', "hello");

try{
    c.publish('chat.*.remote', "ERROR");
} catch (e) { console.log(e); }

try{
    c.publish('chat.**', "ERROR");
} catch (e) { console.log(e); }

try{
    c.subscribe('**.bla', function(){ console.log("ERROR"); });
} catch (e) { console.log(e); }

console.log(util.inspect(p, false, null));
